import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const db = process.env.DB_DATABASE;
console.log(db);

app.use(cors());
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the server!!!" });
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
