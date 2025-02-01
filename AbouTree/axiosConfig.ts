import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://10.0.2.2:5000", // For Android Emulator
  timeout: 10000,
});

export default apiClient;
