import React, { useState, useEffect } from "react";

export default function FullScreenAd({ videos, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);

  // Videoyu biter bitmez sonraki videoya geç
  const handleVideoEnd = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShow(false); // Son video bitince reklamı kapat
      if (onClose) onClose();
    }
  };

  // Kapat butonu
  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center shadow">
      <video
        key={currentIndex}
        src={videos[currentIndex]}
        autoPlay
        muted
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      />
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 bg-gray-800 bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-80"
      >
        X
      </button>
    </div>
  );
}
