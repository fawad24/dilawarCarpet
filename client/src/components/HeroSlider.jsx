import React, { useState, useEffect } from "react";

const imageSets = [
  ["/hero_images/02.png", "/hero_images/1652.JPG", "/hero_images/1653.jpg", "/hero_images/1656.JPG"],
  ["/hero_images/79.jpg", "/hero_images/1646.jpg", "/hero_images/1648.jpg", "/hero_images/1650.jpg"],
  ["/hero_images/1658.jpg", "/hero_images/1659.jpg", "/hero_images/1661.jpg", "/hero_images/1655.jpg"],
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3 /*imageSets.length*/);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[180px] sm:h-[400px] md:h-[300px] lg:h-[500px] mt-32 sm:mt-40 overflow-hidden shadow-2xl rounded-full">
      
      <div className="flex w-full h-full shadow">
        {imageSets[current].map((img, idx) => (
          <div key={idx} className="relative flex-1 overflow-hidden">
            <img
              src={img}
              alt={`Hero ${idx}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Yazı */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10 shadow">
        <h1 className="w-full text-center lg:text-8xl text-3xl sm:text-9xl md:text-6xl drop-shadow-lg">
          D I L A W A R <span className="text-blue-500">C A R P E T</span>
        </h1>
      </div>

    </section>
  );
}