import axios from "axios";

export const baseUrl = axios.create({
  baseURL: "https://api.swiftab.co.ke/swiftab",
  headers: {
    "Content-Type": "application/json",
  },
});
