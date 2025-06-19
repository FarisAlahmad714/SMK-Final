// src/app/components/Hero.js
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import NoSSR from "@/components/ui/NoSSR";

export default function Hero() {
  const media = [
    { type: 'image', src: '/images/hero1.webp' },
    { type: 'video', src: '/images/1.mp4' },
    { type: 'video', src: '/images/2.mp4' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [media.length]);

  return (
    <div className="relative bg-gray-900 h-[600px] overflow-hidden">
      <NoSSR fallback={<div className="absolute inset-0 bg-gray-900" />}>
        <div className="absolute inset-0">
          {media[currentIndex].type === 'image' ? (
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url(${media[currentIndex].src})` }}
            />
          ) : (
            <video
              key={media[currentIndex].src}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
            >
              <source src={media[currentIndex].src} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </NoSSR>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
        <div className="mb-4 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/20">
          <span className="text-sm text-white/90 font-medium">🚗 Premium Auto Dealership Management System</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          SMK-Auto
        </h1>
        <p className="text-xl md:text-2xl text-white mb-4 max-w-3xl">
          Drive Into Your Future: Find Your Next Car!
        </p>
        <p className="text-lg text-white/80 mb-8 max-w-2xl">
          Complete dealership solution with inventory management, customer CRM, and analytics dashboard
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/vehicles"
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            View Inventory
          </Link>
          <Link
            href="/sell-trade"
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Sell/Trade Vehicle
          </Link>
          <Link
            href="/contact"
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
