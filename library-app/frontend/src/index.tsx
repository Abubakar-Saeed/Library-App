import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const clerkKey = "pk_test_aW1tb3J0YWwteWV0aS0zMC5jbGVyay5hY2NvdW50cy5kZXYk";
root.render(
  <ClerkProvider publishableKey={clerkKey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
