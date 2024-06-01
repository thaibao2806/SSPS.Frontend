// src/components/Notifications.js

import React, { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { Toaster, toast } from "react-hot-toast";
import { messaging, requestPermission } from "../firebases"; // Ensure correct import path

const Notifications = ({ onNotification }) => {
  useEffect(() => {
    const setupNotifications = async () => {
      await requestPermission();
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        toast.success(payload.notification.body);
        if (onNotification) {
          onNotification(payload);
        }
      });
    };

    setupNotifications();
  }, [onNotification]);

  return <Toaster />;
};

export default Notifications;
