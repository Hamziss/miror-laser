import React from "react";
import { Link } from "react-router-dom";

export default function LevelsPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <img
        src="/images/main-menu-bg.jpg"
        className="absolute left-0 top-0 z-0 min-h-full min-w-full object-cover"
      ></img>
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black bg-opacity-40"></div>
      <div className="relative z-20 flex h-full flex-col items-start text-white">
        <div className="z-30 flex flex-col gap-36 p-[100px] px-36">
          <Link to="/" unstable_viewTransition>
            <h1 className="text-6xl">BACK TO MENU</h1>
          </Link>
          <ul className="flex flex-col gap-3 text-2xl">
            <Link to="/levels/1" unstable_viewTransition>
              <li className="cursor-pointer opacity-70 hover:opacity-100">
                LEVEL 1
              </li>
            </Link>
            <li className="cursor-pointer line-through opacity-40">LEVEL 2</li>
            <li className="cursor-pointer line-through opacity-40">LEVEL 3</li>
            <li className="cursor-pointer line-through opacity-40">LEVEL 4</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
