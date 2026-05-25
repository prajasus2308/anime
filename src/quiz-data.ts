export interface QuizQuestion {
  question: string;
  options: { text: string; character: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What's your ideal superpower?",
    options: [
      { text: "Unmatched strength", character: "Goku" },
      { text: "Tactical genius", character: "Shikamaru Nara" },
      { text: "Infinite kindness", character: "Tanjiro Kamado" },
      { text: "Unstoppable speed", character: "Levi Ackerman" }
    ]
  },
  {
    question: "How do you handle conflict?",
    options: [
      { text: "Head-on fight", character: "Naruto Uzumaki" },
      { text: "Strategic planning", character: "Sasuke Uchiha" },
      { text: "Diplomacy and understanding", character: "Hinata Hyuga" },
      { text: "Avoid and observe", character: "Light Yagami" }
    ]
  },
  {
    question: "What's your primary motivation?",
    options: [
      { text: "Protecting friends", character: "Monkey D. Luffy" },
      { text: "Revenge", character: "Eren Yeager" },
      { text: "Self-improvement", character: "Ichigo Kurosaki" },
      { text: "Knowledge", character: "Edward Elric" }
    ]
  }
];
