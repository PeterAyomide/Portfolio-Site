import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import RootLayout from "./RootLayout";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>
);
