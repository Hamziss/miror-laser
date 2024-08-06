import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error-page";

import Layout from "./routes/layout";
import LevelsPage from "./routes/levels";
import GamePage from "./routes/levels/id";
import MainMenu from "./routes/main-menu";
const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        id: "main-menu",
        path: "",
        element: <MainMenu />,
        errorElement: <ErrorPage />,
        // children: [
        // 	{
        // 		path: "levels/:levelId",
        // 		element: <Game />,
        // 	},
        // ],
      },
      {
        id: "levels",
        path: "levels",
        element: <LevelsPage />,
      },
      {
        id: "level",
        path: "levels/:id",
        element: <GamePage />,
      },
      {
        id: "game",
        path: "editor",
        element: <GamePage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
