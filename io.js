// io.js
import { Server } from "socket.io";

let io = null;

export const initIO = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
