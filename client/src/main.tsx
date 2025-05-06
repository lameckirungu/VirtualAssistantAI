import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App";
import "./index.css";
import { ChatProvider } from "@/contexts/ChatContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="business-assistant-theme">
    <ChatProvider>
      <App />
    </ChatProvider>
  </ThemeProvider>
);
