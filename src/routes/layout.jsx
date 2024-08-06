import React from "react";
import { Outlet } from "react-router-dom";
import MusicControl from "../components/controller-music";
import SoundEffectController from "../components/controller-sound-effect";

export default function Layout() {
  return (
    <>
      <nav className="absolute right-0 top-10 z-50 flex w-full items-end justify-end px-5 text-white">
        <div className="flex items-center gap-4">
          <SoundEffectController />
          <MusicControl />
        </div>
      </nav>
      <Outlet />
    </>
  );
}
