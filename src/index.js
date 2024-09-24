import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc, updateDoc
} from "firebase/firestore";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7XgcNGqfbViE0EgMZGqACYz2cRn5fa0s",
  authDomain: "fb-9-ca2f9.firebaseapp.com",
  projectId: "fb-9-ca2f9",
  storageBucket: "fb-9-ca2f9.appspot.com",
  messagingSenderId: "962330700117",
  appId: "1:962330700117:web:835738e68cacc6a36527dc"
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// queries
const q = query(colRef, /*where("author", "==", "Patrick Rothfuss"),*/ orderBy("createdAt"));

// realtime collection data
const unsubCol = onSnapshot(q, snapshot => {
  let books = [];
  snapshot.forEach(doc => books.push({ ...doc.data(), id: doc.id }));
  console.log(books);
});

// adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset();
  });
});

// deleting documents
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef)
   .then(() => {
      deleteBookForm.reset();
    });
});

// get a single document
const docRef = doc(db, "books", 'kPtgYz04MJX1ECyssais');

const unsubDoc = onSnapshot(docRef, doc => {
  console.log(doc.data(), doc.id);
})

// updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', e => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    createdAt: serverTimestamp()
  })
  .then(() => updateForm.reset())
  .catch(err => console.error(err));
});

// signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  createUserWithEmailAndPassword(auth, signupForm.email.value, signupForm.password.value)
    .then(cred => {
      //console.log('user created', cred.user);
      signupForm.reset();
    })
    .catch(err => console.error(err));
});

// loggin in and out
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
  signOut(auth)
   //.then(() => console.log('user signed out'))
   .catch(err => console.error(err));
})

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value)
    .then(cred => {
      console.log('user logged in', cred.user);
      loginForm.reset();
    })
    .catch(err => console.error(err));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, user => {
  console.log('user status changed:', user);
});

// unsubscribe from changes (auth & db)
const unsubBtn = document.querySelector('.unsub');
unsubBtn.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCol();
  unsubDoc();
  unsubAuth();
});