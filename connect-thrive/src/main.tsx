import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import axios from "axios"; // 1. Axios import karein

// 2. Global Interceptor Setup
// axios.interceptors.response.use(
//   (response) => response, // Agar response sahi hai, toh kuch mat karo
//   (error) => {
//     // Agar server 401 bhejta hai (Token expire ya galat)
//     if (error.response && error.response.status === 401) {
//       console.warn("Session expired or unauthorized. Logging out...");

//       // Cleanup: Token aur baaki data hatao
//     //   localStorage.removeItem("token");
//     //   localStorage.removeItem("username");

//       // Redirect to login page
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   },
// );
createRoot(document.getElementById("root")!).render(<App />);
