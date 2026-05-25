export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export const TRIVIA_DATA: TriviaQuestion[] = [
  {
    id: 1,
    question: "Who is the King of Curses in Jujutsu Kaisen?",
    options: ["Gojo", "Sukuna", "Yuji", "Toji"],
    answer: "Sukuna"
  },
  {
    id: 2,
    question: "Who is the strongest hero in One Punch Man?",
    options: ["Genos", "Saitama", "Garou", "Tatsumaki"],
    answer: "Saitama"
  },
  {
    id: 3,
    question: "What is the name of Luffy's ship?",
    options: ["Going Merry", "Thousand Sunny", "Red Force", "Moby Dick"],
    answer: "Thousand Sunny"
  },
  {
    id: 4,
    question: "Which hashira is known for his fiery heart?",
    options: ["Shinobu", "Giyu", "Rengoku", "Tanjiro"],
    answer: "Rengoku"
  },
  {
    id: 5,
    question: "Who is the vessel of the Nine-Tailed Fox?",
    options: ["Sasuke", "Kakashi", "Naruto", "Jiraiya"],
    answer: "Naruto"
  }
];
