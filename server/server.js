const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const redis = require("redis");
const Pixel = require("./models/Pixel");
const http = require("http");

// const REDIS_PORT = 6379;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// mongodb deployment
const uri =
  "mongodb+srv://davidl21:0WAMI0XUL9wRKUky@cluster0.ylbr58b.mongodb.net/opencanvas?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function startServer() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB");
    // Start the server and perform any initial setup
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();

// new redis instance
const redisClient = redis.createClient();

redisClient
  .connect()
  .then(async () => {
    console.log("Connected to Redis.");
    await loadInitialState();
  })
  .catch((err) => {
    console.error("Redis connection failed:", err);
  });

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

const loadInitialState = async () => {
  const pixels = await Pixel.find({});
  pixels.forEach((pixel) => {
    const key = `${pixel.x}:${pixel.y}`;
    const value = JSON.stringify(pixel.color);
    redisClient.set(key, value);
  });
};

io.on("connection", (socket) => {
  console.log("New client connected.");

  // send cached canvas state to new user.
  redisClient.keys("*", (err, keys) => {
    if (err) throw err;
    keys.forEach((key) => {
      redisClient.get(key, (err, value) => {
        if (err) throw err;
        const [x, y] = key.split(":").map(Number);
        const color = JSON.parse(value);
        socket.emit("draw", { x, y, color });
      });
    });
  });

  socket.on("draw", async ({ x, y, color }) => {
    const key = `${x}:${y}`;
    const value = JSON.stringify(color);

    redisClient.set(key, value);

    const pixel = new Pixel({ x, y, color });
    await Pixel.findOneAndUpdate({ x, y }, pixel, { upsert: true });

    socket.broadcast.emit("draw", { x, y, color });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// board setup and clearing in mongodb
const initializeBoard = async () => {
  try {
    const pixels = [];
    const pixelSize = 5;
    const gridSize = 500 / pixelSize;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        pixels.push({
          x: x * pixelSize,
          y: y * pixelSize,
          color: { r: 255, g: 255, b: 255, a: 1 },
        });
      }
    }

    // Clear previous board
    await Pixel.deleteMany({});
    console.log("Previous board cleared.");

    // Insert new board
    await Pixel.insertMany(pixels);
    console.log("Board initialized with white canvas.");
  } catch (error) {
    console.error("Error initializing board:", error);
  }
};

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Successfully connected.",
  });
});

app.post("/api/initialize", async (req, res) => {
  try {
    await initializeBoard();
    res.status(200).send({
      message: "Canvas initialized successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error initializing canvas.",
      error: error,
    });
  }
});

app.get("/api/canvas-state", async (req, res) => {
  try {
    const getKeys = () => {
      return new Promise((resolve, reject) => {
        redisClient.keys("*", (err, keys) => {
          if (err) return reject(err);
          resolve(keys);
        });
      });
    };

    const getValue = (key) => {
      return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
          if (err) return reject(err);
          resolve(value);
        });
      });
    };

    const keys = await getKeys();

    const canvasStatePromises = keys.map(async (key) => {
      const value = await getValue(key);
      const [x, y] = key.split(":").map(Number);
      const color = JSON.parse(value);
      return { x, y, color };
    });

    const canvasState = await Promise.all(canvasStatePromises);

    res.status(200).send(canvasState);
  } catch (error) {
    res.status(500).send({
      message: "Error fetching canvas state.",
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000.");
});

const port = 4000;
server.listen(port, () =>
  console.log(`HTTP WebSocket Server listening on port ${port}`)
);
