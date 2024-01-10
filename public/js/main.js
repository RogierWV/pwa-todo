// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let items = [
    {title: "learn to PWA", done: false},
    {title: "go offline", done: false},
    {title: "get espresso", done: true}
]

const list = document.getElementById("todo");
const input = document.getElementById("newInput");

function createItem({title, done}) {
    let li = document.createElement("li")
    li.appendChild(document.createTextNode(title))
    if(done) li.classList.add("done");
    li.addEventListener('click', () => {
        let itm = items.filter((i) => i.title === title)[0];
        itm.done = !itm.done;
        render();
    });
    return li;
}

function addItem() {
    let text = input.value;
    if(text && (items.filter(i => i.title === text).length === 0)) {
        let item = {title: input.value, done: false};
        input.value = "";
        items.push(item);
        console.log(item);
        render();
    }
}

function render() {
    list.innerHTML = "";
    items.forEach(item => {
        list.appendChild(createItem(item));
    });
}

window.onload = function() {
    const todoRef = ref(database, "todo");
    onValue(todoRef, (snapshot) => {
        console.log(snapshot.val());
    });
    get(todoRef).then(snapshot => {
        if(snapshot.exists())
            console.log(snapshot.val());
        else
            console.log("No data from Firebase!");
    });
    render();
    document.getElementById("newButton").addEventListener("click", addItem);
}
