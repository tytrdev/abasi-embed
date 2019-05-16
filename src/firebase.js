import Firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyDAMD7_FNdU0S6u7Yzyo5oo-TUVZND3B14",
  authDomain: "abasi-configurator.firebaseapp.com",
  databaseURL: "https://abasi-configurator.firebaseio.com",
  projectId: "abasi-configurator",
  storageBucket: "gs://abasi-configurator",
  messagingSenderId: "90569062003"
};

Firebase.initializeApp(config);

// Firebase
export default Firebase;

// Auth
export const Auth = Firebase.auth();
export const DB = Firebase.firestore();
export const Storage = Firebase.storage();