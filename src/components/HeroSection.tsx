
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const quotes = [
  "The best way to predict the future is to create it. 🚀",
  "Consistency is the key to mastery. 🔑",
  "Small daily improvements lead to stunning results. ✨",
  "Your future self will thank you for the work you put in today. 🙏",
  "The secret to getting ahead is getting started. 🏁",
  "Algorithms are just recipes for solving problems. 🧩",
  "DSA is not about memorizing, but understanding patterns. 🧠",
  "Today's effort is tomorrow's reward. 💎",
];

const tips = [
  "Review graph algorithms regularly—they appear in ~40% of interviews.",
  "Don't just solve problems, understand the patterns behind them.",
  "Practice explaining your thought process out loud while coding.",
  "Try to solve each problem in multiple ways for better understanding.",
  "Keep a log of problems you struggled with and review weekly.",
  "Focus on time and space complexity for each solution.",
  "When stuck, break the problem into smaller components.",
  "Create visualizations for complex algorithms to deepen understanding.",
];

const HeroSection = () => {
  const [quote, setQuote] = React.useState('');
  const [tip, setTip] = React.useState('');

  React.useEffect(() => {
    // Get random quote and tip
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setQuote(randomQuote);
    setTip(randomTip);
  }, []);

  return (
    <div className="w-full px-4 py-8 md:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto text-center animate-slide-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-8 h-8 text-primary" />
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Teja DSA Journey 🚀
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Track your discipline, build habits, and grow daily.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-medium text-lg mb-2 text-gray-700">Today's Motivation</h3>
            <p className="italic text-gray-600">{quote || "Loading..."}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-medium text-lg mb-2 text-gray-700">Daily DSA Tip</h3>
            <p className="text-gray-600">{tip || "Loading..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
