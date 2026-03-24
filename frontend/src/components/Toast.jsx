import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export default function Toast() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  const getStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${getStyle(notif.type)} text-white px-4 py-3 rounded shadow-lg flex justify-between items-center min-w-max max-w-md animate-slide-in`}
        >
          <span>{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="ml-4 font-bold text-lg hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
