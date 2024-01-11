// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getFirestore, onSnapshot, doc, getDoc, updateDoc, deleteField} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
// const analytics = getAnalytics(app);
const database = getFirestore(app);
const todoRef = doc(database, "todo", "todo");
// const connectedRef = ref(database, ".info/connected");

const list = document.getElementById("todo");
const input = document.getElementById("newInput");
function createItem({title, done}) {
    let li = document.createElement("li")
    li.classList.add('todo-item');
    let a = document.createElement('button');
    a.appendChild(document.createTextNode(" 🗑 "))
    a.addEventListener('click', () => {
        updateDoc(todoRef, {[title]: deleteField()})
        .then(() => console.log(`${title} deleted`));
    })
    
    let check = document.createElement("input");
    check.type = "checkbox"
    if(done) check.checked = "checked";
    // check.disabled = true;
    check.onclick = () => false; //looks prettier than disabling
    
    let span = document.createElement('label');
    span.appendChild(document.createTextNode(title));
    span.addEventListener('click', () => {
        getDoc(todoRef).then(doc => {
            if(doc.exists)
                return updateDoc(todoRef,{[title]: !doc.data()[title]});
        })
        .then(() => console.log(`Set ${title}`))
        .catch(e => console.error(`Failed to set ${title}: ${e}`));
    });
    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(a);
    // if(done) li.classList.add("done");
    return li;
}

async function addItem() {
    let text = input.value;
    if(text) {
        input.value = "";
        await updateDoc(todoRef, {[text]: false});
    }
}

window.onload = function() {
    if ("serviceWorker" in navigator) {
        // Register a service worker hosted at the root of the
        // site using the default scope.
        navigator.serviceWorker.register("/sw.js").then(
            (registration) => {
                console.log("Service worker registration succeeded:", registration);
            },
            (error) => {
                console.error(`Service worker registration failed: ${error}`);
            }
        );
    } else {
        console.error("Service workers are not supported.");
    }

    onSnapshot(todoRef, doc => {
        if(doc.data()) {
            list.innerHTML = "";
            for (const [k,v] of Object.entries(doc.data()).sort()) 
                list.appendChild(createItem({title:k, done:v}));
        }
    });

    document.getElementById("newButton").addEventListener("click", addItem);
}