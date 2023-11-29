import express from "express";

const app = express();
const port = process.env.EXPRESS_PORT;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

export const startServer = () => {
  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
};
