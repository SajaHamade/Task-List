import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { fetchTasks, createTasks, updateTasks, DeleteTasks } from "./task.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const port = 3001;

console.log("DEVELOPMENT mode:", process.env.DEVELOPMENT);

// Middleware to parse JSON bodies
app.use(express.json());

// CORS setup - allow all origins in development, restrict in production
app.use(
  cors({
    origin:
      /*process.env.DEVELOPMENT === "true"
        ? "*" // Allow all origins in development
        : */ "https://main.d1p7ceotkt5ufd.amplifyapp.com", // Your deployed frontend URL in prod
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Preflight requests handler for all routes
//app.options("*", cors());

// Optional: simple request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

/*
app.use((req, res) => {
  console.log(`Unknown route: ${req.method} ${req.path}`);
  res.status(404).send("Not Found");
}); */

app.get("/task", async (req, res) => {
  try {
    const tasks = await fetchTasks();
    res.send(tasks.Items || []); // fallback to empty array if undefined
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send(`Error fetching tasks: ${error.message || error}`);
  }
});

app.post("/task", async (req, res) => {
  try {
    const task = req.body;
    console.log("Received task is ", task);
    const response = await createTasks(task);
    res.send(response);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send(`Error creating task: ${error.message || error}`);
  }
});

app.put("/task", async (req, res) => {
  try {
    const task = req.body;
    console.log("Received task is ", task);
    const response = await updateTasks(task);
    res.send(response);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send(`Error updating task: ${error.message || error}`);
  }
});

app.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await DeleteTasks(id);
    res.send(response);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send(`Error deleting task: ${error.message || error}`);
  }
});

if (process.env.DEVELOPMENT === "true") {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app, {
  request: (req, event, context) => {
    if (event.body && typeof event.body === "string") {
      try {
        req.body = JSON.parse(event.body);
      } catch (e) {
        console.error("Invalid JSON in body:", e);
      }
    }
  },
});
