import React, { useState, useEffect, useRef } from "react";

export default function VideoAd({ videos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.load();
      video.play().catch((err) => console.log("Video play hatası:", err));
    }
  }, [currentIndex]);

  const handleVideoEnd = () => {
    if (videos.length === 1) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    } else {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }
  };

  return (
    <div className="relative w-full h-[100px] lg:h-[800px] mt-40 mb-56 flex justify-center items-center">
      <video
        ref={videoRef}
        key={currentIndex}
        src={videos[currentIndex]}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        controls={false}
        disablePictureInPicture
        onEnded={handleVideoEnd}
        className="w-full max-h-[900px] object-cover shadow-lg pointer-events-none"
      />
    </div>
  );
}