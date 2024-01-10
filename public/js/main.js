// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs9hMiNEEUv1F-muWAL_3kXL-cvML4QPg",
  authDomain: "pwa-todo-38b6f.firebaseapp.com",
  projectId: "pwa-todo-38b6f",
  storageBucket: "pwa-todo-38b6f.appspot.com",
  messagingSenderId: "980216304370",
  appId: "1:980216304370:web:7f73a131ee0d29b538766b",
  measurementId: "G-JXTW212B9Z",
  databaseURL: "https://pwa-todo-38b6f-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const todoRef = ref(database, "todo");
const connectedRef = ref(database, ".info/connected");

const list = document.getElementById("todo");
const input = document.getElementById("newInput");
function createItem({title, done}) {
    let li = document.createElement("li")
    li.appendChild(document.createTextNode(title))
    if(done) li.classList.add("done");
    li.addEventListener('click', () => {
        get(ref(database, `todo/${title}`)).then(snap => {
            if(snap.exists()) {
                return set(ref(database, `todo/${title}`), !snap.val());
            } else {
                return set(ref(database, `todo/${title}`), false);
            }
        }).then(() => {
            console.log(`Set ${title}`);
        }).catch(e => {
            console.error(`Failed to set ${title}: ${e}`);
        });
    });
    return li;
}

function addItem() {
    let text = input.value;
    if(text) {
        get(ref(database, `todo/${text}`)).then(snap => {
            if(!snap.exists()) {
                input.value = "";
                set(ref(database, `todo/${text}`, false)).then(() => console.log(`Set ${text}`));
            }
        })
        
    }
}

window.onload = function() {
    onValue(todoRef, (snapshot) => {
        if(snapshot.exists()) {
            list.innerHTML = "";
            for(const [key,value] of Object.entries(snapshot.val())) {
                list.appendChild(createItem({title: key, done: value}));
            }
        }
    });
    onValue(connectedRef, snapshot => {
        if(snapshot.val())
            console.log("Connected to Firebase!");
        else
            console.log("Disconnected from Firebase!");
    });
    document.getElementById("newButton").addEventListener("click", addItem);
}