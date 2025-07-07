import express from "express";
import { fetchTasks, createTasks, updateTasks, DeleteTasks } from "./task.js";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3001;

console.log(process.env.DEVELOPMENT);

app.use(express.json()); //to access the body of the request

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/task", async (req, res) => {
  try {
    const tasks = await fetchTasks();
    res.send(tasks.items);
  } catch (error) {
    res.status(400).send(`Error fetching tasks ${error}`);
  }
});

app.post("/task", async (req, res) => {
  try {
    const task = req.body;
    const response = await createTasks(task);
    res.send(response);
  } catch (error) {
    res.status(400).send(`Error Creating tasks ${error}`);
  }
});

app.put("/task", async (req, res) => {
  try {
    const task = req.body;
    const response = await updateTasks(task);
    res.send(response);
  } catch (error) {
    res.status(400).send(`Error updating tasks ${error}`);
  }
});

app.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await DeleteTasks(id);
    res.send(response);
  } catch (error) {
    res.status(400).send(`Error Deleting tasks ${error}`);
  }
});

if (process.env.DEVELOPMENT) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);
