
import {getFirestore} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {

    // firebase credentials
};




const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
