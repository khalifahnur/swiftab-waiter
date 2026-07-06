import axios from "axios";

export const api = axios.create({
  baseURL: "https://88a8-105-164-128-121.ngrok-free.app/swiftab", //"https://server-production-2ee7.up.railway.app/swiftab",
  headers: {
    "Content-Type": "application/json",
  },
});
