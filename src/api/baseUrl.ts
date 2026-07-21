import axios from "axios";

export const baseUrl = axios.create({
  baseURL: "https://api.swiftab.co.ke/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});
