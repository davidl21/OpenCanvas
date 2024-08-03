const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const redis = require("redis");
const Pixel = require("./models/Pixel");
const http = require("http");

const REDIS_PORT = 6379;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// mongodb deployment
const uri =
  "mongodb+srv://davidl21:0WAMI0XUL9wRKUky@cluster0.ylbr58b.mongodb.net/opencanvas?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

const redisClient = redis.createClient(REDIS_PORT);

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

// const loadInitialState = async () => {
//   const pixels = await Pixel.find({});
//   pixels.forEach((pixel) => {
//     const key = `${pixel.x}:${pixel.y}`;
//     const value = JSON.stringify(pixel.color);
//     redisClient.set(key, value);
//   });
// };
// loadInitialState();

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
    await Pixel.fineOneAndUpdate({ x, y }, pixel, { upsert: true });

    socket.broadcast.emit("draw", { x, y, color });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const initializeBoard = async () => {
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
  // clear previous board
  await Pixel.deleteMany({});
  await Pixel.insertMany(pixels);
  console.log("Board initialized with white canvas.");
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

app.listen(3000, () => {
  console.log("Server listening on port 3000.");
});

const port = 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));
