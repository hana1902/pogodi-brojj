const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Igrač povezan");

  socket.on("inputChange", (data) => socket.broadcast.emit("inputChange", data));
  socket.on("colorChange", (data) => socket.broadcast.emit("colorChange", data));
  socket.on("reset", () => socket.broadcast.emit("reset"));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
