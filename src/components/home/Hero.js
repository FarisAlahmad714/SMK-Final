"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  // 1. Our array of images
  const images = [
    "/images/hero1.webp",
    "/images/hero2.jpg",
    "/images/hero3.png",
  ];

  // 2. Track the current slide
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 3. Automatically advance slides every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [images.length]);

  // 4. Current background image
  const backgroundImageStyle = {
    backgroundImage: `url(${images[currentIndex]})`,
  };

  return (
    <div className="relative bg-gray-900 h-[600px] overflow-hidden">
      {/* The slides container with absolute positioning */}
      <div className="absolute inset-0">
        <div
          className={`w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out`}
          style={backgroundImageStyle}
        />
        {/* A slight overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          SMK-Auto
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
          Experience our curated collection of premium vehicles, 
          where luxury meets exceptional performance.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/vehicles"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Inventory
          </Link>
          <Link
            href="/contact"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
