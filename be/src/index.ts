import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/test-task";

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", mongodb: MONGODB_URI });
});

app.listen(PORT, () => {
  console.log(`Serversssssss running on http://localhost:${PORT}`);
  console.log(`MongoDB URI: ${MONGODB_URI}`);
});
