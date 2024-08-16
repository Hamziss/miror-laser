import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { levels } from "@/contants";
import { useGameStore } from "@/store/useGameStore";
import { useLevelStore } from "@/store/useLevelStore";
import { useUserStore } from "@/store/useUser";
import { Home, Play, RotateCcw } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function EndLevelDialog({
  score = 1000,
  isOpen = true,
  onRestart,
  onHome,
}) {
  const { levelCompleted, reset } = useGameStore();
  const { currentLevelId } = useUserStore();
  const { loadLevelData } = useLevelStore((state) => ({
    loadLevelData: state.loadLevelData,
  }));
  const navigate = useNavigate();
  const onNextLevel = () => {
    navigate(`/levels/${currentLevelId}`);
    reset();
    loadLevelData("bcfcd1a8-9ec0-42a7-adce-ff07cba85fd4");
  };
  const currentLevel = levels.find((level) => level.id === currentLevelId);

  return (
    <div className="relative">
      <AlertDialog open={levelCompleted}>
        <AlertDialogContent
          className="border-2 border-white bg-[url('/images/popup-bg.jpg')] bg-cover bg-center bg-no-repeat text-white shadow-lg"
          style={{ backgroundSize: "185%" }}
        >
          {" "}
          <div className="absolute inset-0 -z-10 bg-black bg-opacity-25"></div>
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-center text-3xl font-bold">
              {currentLevel.category.toUpperCase()} {currentLevel.level}{" "}
              Completed!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xl">
              Congratulations! You've cleared the level with a score of {score}{" "}
              points.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-6 flex justify-center">
            <div className="rounded-full bg-white/80 p-6 text-4xl font-bold text-purple-600">
              {score}
            </div>
          </div>
          <AlertDialogFooter className="flex items-end !justify-between">
            <AlertDialogCancel
              onClick={onRestart}
              className="h-14 w-14 rounded-full bg-yellow-500 text-white hover:bg-yellow-600"
            >
              <RotateCcw />
              {/* Restart */}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onNextLevel}
              className="h-20 w-20 rounded-full bg-green-500 text-white hover:bg-green-600"
            >
              <Play />
              {/* Next Level */}
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => navigate("/")}
              className="h-14 w-14 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <Home />
              {/* Home */}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
