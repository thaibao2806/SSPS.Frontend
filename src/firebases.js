  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import {getMessaging, getToken, onMessage} from 'firebase/messaging'
  import { getStorage } from "firebase/storage";
  import { getFirestore } from "firebase/firestore"
  import { getAuth, signInAnonymously } from "firebase/auth";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBHgi5s7_JyobGbImEKKxb7Qsc4Qf9pt8c",
    authDomain: "spss-7ddb5.firebaseapp.com",
    projectId: "spss-7ddb5",
    storageBucket: "spss-7ddb5.appspot.com",
    messagingSenderId: "917993715372",
    appId: "1:917993715372:android:634e5da9c8f06b95fa1109",
    //measurementId: "G-6J1MYCELZW"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const messaging = getMessaging(app)
  export const imageStore = getStorage(app)
  export const txtDB = getFirestore(app)
  export const auth = getAuth(app);

  export const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      console.log(permission);
      if (permission === 'granted') {
        try {
          const token = await getToken(messaging, {
            vapidKey: "BOqV5cnHhm9TC1gNb3CSAJJ14jCaDEyDc2kq6dq_6InB3EONCwkiNWd8FCTiZ0lDRFzvGiRjg1XPFVnG_N767-U"
          });
          console.log("token", token);
        } catch (error) {
          console.error("An error occurred while retrieving the token. ", error);
        }
      }
    };

