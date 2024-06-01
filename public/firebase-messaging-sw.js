// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBHgi5s7_JyobGbImEKKxb7Qsc4Qf9pt8c",
  authDomain: "spss-7ddb5.firebaseapp.com",
  projectId: "spss-7ddb5",
  storageBucket: "spss-7ddb5.appspot.com",
  messagingSenderId: "917993715372",
  appId: "1:917993715372:android:634e5da9c8f06b95fa1109",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);

  
  // Send message to the client (application)
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_RECEIVED',
        payload: payload
      });
    });
  });
});
