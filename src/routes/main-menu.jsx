import Spline from "@splinetool/react-spline";
import React from "react";
import { Link } from "react-router-dom";

export default function MainMenu() {
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
          <h1 className="text-6xl">MENU</h1>
          <ul className="flex flex-col gap-3 text-2xl">
            <Link to="/levels" unstable_viewTransition>
              <li className="cursor-pointer opacity-60 hover:opacity-100">
                PLAY
              </li>
            </Link>
            <li className="cursor-pointer opacity-60 hover:opacity-100">
              HEROES
            </li>
            <li className="cursor-pointer opacity-60 hover:opacity-100">
              OPTIONS
            </li>
            <li className="cursor-pointer opacity-60 hover:opacity-100">
              QUIT
            </li>
          </ul>
        </div>
        <div className="absolute h-full w-full">
          <Spline scene="https://prod.spline.design/UCNChuk1Omz7U3Kn/scene.splinecode" />
        </div>
      </div>
    </main>
  );
}
