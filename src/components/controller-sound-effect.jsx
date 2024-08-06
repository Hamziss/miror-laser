import { Volume2, VolumeX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const SoundEffectController = () => {
  const [isSoundOn, setIsSoundOn] = useState(() => {
    // Initialize state from localStorage, defaulting to true if not set
    const stored = localStorage.getItem("isSoundEffectOn");
    return stored === null ? true : JSON.parse(stored);
  });

  useEffect(() => {
    // Update localStorage when state changes
    localStorage.setItem("isSoundEffectOn", JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  const toggleSound = () => {
    setIsSoundOn((prevState) => !prevState);
  };

  return (
    <Button
      onClick={toggleSound}
      size="icon"
      className="fixed right-[84px] top-3 h-16 w-16 bg-gray-800 p-2"
      aria-label={
        isSoundOn ? "Turn sound effects off" : "Turn sound effects on"
      }
    >
      {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      {/* <span className="text-sm">Sound FX: {isSoundOn ? "ON" : "OFF"}</span> */}
    </Button>
  );
};

export default SoundEffectController;
