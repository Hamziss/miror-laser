import cors from "cors";
import express from "express";
import { levels } from "./levels";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.send(`Express on Vercel ${levels[0].hash}`);
});

app.post("/levels/:id", (req, res) => {
  const { levelKey } = req.body;
  const foundLevel = levels.find((l) => l.id === req.params.id);
  if (!foundLevel) {
    return res.status(404).send("Level not found");
  }

  if (foundLevel.hash === levelKey) {
    return res.send({
      success: true,
      next_level: levels[foundLevel.level].id,
      next_level_hash: levels[foundLevel.level].hash,
    });
  }
  return res.send(`Express on Vercel ${levels[0].hash}`);
});

app.get("/levels", (req, res) => {});

app.listen(5000, () => console.log("Server ready on port 5000."));

export default app;
