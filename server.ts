import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.use(express.json());

  // API route
  app.post("/api/match", async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const nameLower = name.toLowerCase().trim();
    
    // Check for fixed matches
    const fixedMatches: Record<string, { characterName: string; quote: string; description: string }> = {
      "pratyush raj": { characterName: "Legend of the first generation", quote: "True power rests with those who started it all.", description: "A legendary figure who paved the way for those who followed." },
      "pratyush": { characterName: "Legend of the first generation", quote: "True power rests with those who started it all.", description: "A legendary figure who paved the way for those who followed." },
      "anish": { characterName: "White ghost of first generation", quote: "I move unseen, the shadow of the past.", description: "A mysterious, elusive warrior known for his unparalleled stealth." },
      "anish mahta": { characterName: "White ghost of first generation", quote: "I move unseen, the shadow of the past.", description: "A mysterious, elusive warrior known for his unparalleled stealth." },
      "vedang": { characterName: "King of the first generation", quote: "A king always commands the future.", description: "A commanding leader with a vision for the ages." },
      "kushagra": { characterName: "Sukuna", quote: "Know your place, you fool.", description: "The uncontested King of Curses, radiating overwhelming power and malice." },
      "hridyansh": { characterName: "Brian Griffin", quote: "Don't judge me until you've tasted the struggle.", description: "An intellectual and writer, often misunderstood but deeply resilient." },
      "dodo": { characterName: "Brian Griffin", quote: "Don't judge me until you've tasted the struggle.", description: "An intellectual and writer, often misunderstood but deeply resilient." },
      "rohan kishibe": { characterName: "Rohan Kishibe", quote: "I will not lose!", description: "A brilliant and somewhat eccentric manga artist who seeks perfection in his work." },
      "lelouch lamperouge": { characterName: "Lelouch Lamperouge", quote: "The world is built on lies.", description: "A brilliant strategist who fights to reshape the world from the shadows." },
    };

    if (fixedMatches[nameLower]) {
      return res.json(fixedMatches[nameLower]);
    }

    try {
      const callAIWithRetry = async (retries = 5, delay = 2000): Promise<any> => {
        try {
          return await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Given the user's name: ${name}, match them to a well-known anime character based on a playful personality assessment. Return the character name and a short, fun, character-based quote. Return in JSON format.`,
            config: {
                responseMimeType: "application/json",
                systemInstruction: "You are a fun, playful anime matcher assistant. Always reply with characterName, quote, and description in JSON. NO REASON. Choose from characters like: Thorfinn, Askeladd, Canute, Thorkell, Thors, Lelouch vi Britannia, Suzaku Kururugi, C.C., Kallen Stadtfeld, Schneizel el Britannia, Shinei Nouzen, Vladilena Milizé, Raiden Shuga, Anju Emma, Kurena Kukumila, Xin, Ying Zheng, Wang Qi, Kyou Kai, He Liao Diao, Tanya von Degurechaff, Viktoriya Ivanovna Serebryakov, Erich von Rerugen, Kurt von Rudersdorf, Hans von Zettour, Amuro Ray, Char Aznable, Bright Noa, Kira Yamato, Athrun Zala, Son Goku, Vegeta, Gohan, Piccolo, Future Trunks, Frieza, Cell, Majin Buu, Bulma, Krillin, Naruto Uzumaki, Sasuke Uchiha, Sakura Haruno, Kakashi Hatake, Itachi Uchiha, Madara Uchiha, Jiraiya, Tsunade, Orochimaru, Gaara, Hinata Hyuga, Minato Namikaze, Monkey D. Luffy, Roronoa Zoro, Nami, Usopp, Vinsmoke Sanji, Tony Tony Chopper, Nico Robin, Franky, Brook, Jinbe, Portgas D. Ace, Shanks, Trafalgar D. Water Law, Yuji Itadori, Megumi Fushiguro, Nobara Kugisaki, Satoru Gojo, Ryomen Sukuna, Kento Nanami, Suguru Geto, Yuta Okkotsu, Maki Zenin, Toge Inumaki, Aoi Todo, Mahito, Tanjiro Kamado, Nezuko Kamado, Zenitsu Agatsuma, Inosuke Hashibira, Giyu Tomioka, Kyojuro Rengoku, Shinobu Kocho, Tengen Uzui, Muichiro Tokito, Mitsuri Kanroji, Muzan Kibutsuji, Akaza, Izuku Midoriya, Katsuki Bakugo, Shoto Todoroki, All Might, Ochaco Uraraka, Tenya Iida, Shota Aizawa, Tomura Shigaraki, Dabi, Himiko Toga, Endeavor, Gon Freecss, Killua Zoldyck, Kurapika, Leorio Paradinight, Hisoka Morow, Chrollo Lucilfer, Illumi Zoldyck, Isaac Netero, Meruem."
            }
          });
        } catch (error: any) {
          if (retries > 0 && (error.status === 503 || error.code === 503)) {
            const jitter = Math.random() * 1000;
            console.log(`Retrying API call, ${retries} retries left. Waiting ${delay + jitter}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay + jitter));
            return callAIWithRetry(retries - 1, delay * 2);
          }
          throw error;
        }
      };

      const response = await callAIWithRetry();
      
      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to match anime character" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
