import React, { useRef, useState } from "react";
import { Button } from "./ui/button";

const AnimatedAudioLines = ({ isPlaying }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {[2, 6, 10, 14, 18, 22].map((x, index) => (
        <path
          key={x}
          d={`M${x} ${isPlaying ? 10 - (index % 3) * 2 : 10}v${isPlaying ? 3 + (index % 3) * 2 : 3}`}
        >
          {isPlaying && (
            <animate
              attributeName="d"
              values={`M${x} ${10 - (index % 3) * 2}v${3 + (index % 3) * 2};M${x} ${12 - (index % 4) * 3}v${(index % 4) * 3};M${x} ${10 - (index % 3) * 2}v${3 + (index % 3) * 2}`}
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </path>
      ))}
    </svg>
  );
};

const MusicControl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/hans.mp3"
        onEnded={handleEnded}
        preload="auto"
      />
      <Button
        size="icon"
        onClick={togglePlay}
        className="fixed right-3 top-3 z-10 h-16 w-16 bg-gray-800 p-2"
      >
        <AnimatedAudioLines isPlaying={isPlaying} />
      </Button>
    </>
  );
};

export default MusicControl;
