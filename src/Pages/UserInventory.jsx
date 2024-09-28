import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: "Clothes", icon: "👕" },
  { name: "Footwears", icon: "👟" },
  { name: "Accessories", icon: "👜" },
];

export default function UserInventory() {
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-500 flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-white mb-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        User Inventory
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            className={`bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-gray-700 ${
              hoveredIndex === index ? 'bg-opacity-70' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 0 : 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {loading ? (
              <div className="shimmer w-full h-32 bg-gray-300 rounded-lg animate-pulse mb-4" />
            ) : (
              <>
                <span className="text-6xl mb-4">{category.icon}</span>
                <h2 className="text-2xl font-semibold text-white">{category.name}</h2>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* CSS for shimmer effect */}
      <style jsx>{`
        .shimmer {
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.2) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
