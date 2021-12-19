import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyB9h8plFgZ1icx9g9XMRYU3vYUKnlYimA4',
    authDomain: 'amerikanerne-1af32.firebaseapp.com',
    projectId: 'amerikanerne-1af32',
    storageBucket: 'amerikanerne-1af32.appspot.com',
    messagingSenderId: '186724285630',
    appId: '1:186724285630:web:e7de9022be3d997dee72ef',
};

initializeApp(firebaseConfig);

ReactDOM.render(
    <React.StrictMode>
        <div id="modal" style={{ height: '100%' }} />
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
