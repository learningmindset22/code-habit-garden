
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const dsaQuotes = [
  "The best time to learn algorithms was yesterday. The second best time is today. 🧠",
  "DSA is like strength training for programmers - tough but transformational. 💪",
  "Recursion is like a dream within a dream - confusing at first, elegant once mastered. 🌀",
  "Elegant algorithms are often more valuable than elegant code - focus on understanding. 🏆",
  "The best way to understand a problem is to solve it yourself. 🧩",
  "Big O notation is just fancy talk for 'will this work when we scale?'. 📈",
  "Patience and persistence are your best allies when learning DSA. 🌱",
  "Trees and graphs aren't just concepts - they're models of how the world connects. 🌲",
  "The secret to mastering algorithms? Consistent practice and fearless debugging. 🔍",
  "Your solution might not be perfect, but progress beats perfection every time. 🚀",
  "Sorting algorithms teach us that there's always more than one way to solve a problem. 🔄",
  "Dynamic programming is just breaking down big problems into smaller ones you've already solved. 🧱",
  "Code is read more often than it is written. Optimize for understanding. 📚",
  "Don't just memorize algorithms - understand the thinking behind them. 🤔",
  "Every expert was once a beginner. Keep pushing through the confusion. ⭐"
];

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  
  useEffect(() => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * dsaQuotes.length);
    setQuote(dsaQuotes[randomIndex]);
  }, []);
  
  return (
    <Card className="shadow-sm border-primary/10 mb-6 bg-gradient-to-r from-primary/5 to-primary/10 animate-fade-in">
      <CardContent className="py-4 px-5 text-center">
        <p className="text-sm md:text-base italic text-gray-700">{quote}</p>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuote;
