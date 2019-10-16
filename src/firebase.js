import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

// const config = {
//   apiKey: 'AIzaSyDAMD7_FNdU0S6u7Yzyo5oo-TUVZND3B14',
//   authDomain: 'abasi-configurator.firebaseapp.com',
//   databaseURL: 'https://abasi-configurator.firebaseio.com',
//   projectId: 'abasi-configurator',
//   storageBucket: 'gs://abasi-configurator',
//   messagingSenderId: '90569062003',
// };

const config = {
  apiKey: 'AIzaSyCjb3VLsooJiU_76X5E_01CAWQmonw02KI',
  authDomain: 'abasi-be671.firebaseapp.com',
  databaseURL: 'https://abasi-be671.firebaseio.com',
  projectId: 'abasi-be671',
  storageBucket: 'gs://abasi-be671.appspot.com',
  messagingSenderId: '542547688458',
  appId: '1:542547688458:web:c73f5d8276968104adb3f3',
};

Firebase.initializeApp(config);

// Firebase
export default Firebase;

// Auth
export const Auth = Firebase.auth();
export const DB = Firebase.firestore();
export const Storage = Firebase.storage();
