/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyCr1YE2l3qCNRIerh-8jhdg7HnKhSqilEM",
    authDomain: "team-5-webstore.firebaseapp.com",
    projectId: "team-5-webstore",
    storageBucket: "team-5-webstore.appspot.com",
    messagingSenderId: "620195896772",
    appId: "1:620195896772:web:4d4ec3521bcc2556c21891",
    measurementId: "G-7VWHRTGJ06"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
