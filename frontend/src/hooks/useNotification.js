import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return {
    success: (message, duration = 3000) => context.addNotification(message, "success", duration),
    error: (message, duration = 3000) => context.addNotification(message, "error", duration),
    warning: (message, duration = 3000) => context.addNotification(message, "warning", duration),
    info: (message, duration = 3000) => context.addNotification(message, "info", duration),
  };
}
