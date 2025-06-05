"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

import { createNewCollection } from "@/lib/firebaseHelpers/helpers";
import Navbar from "@/app/components/navbar";

const db = getFirestore();
const storage = getStorage();

export default function UserPage() {
  const { uid } = useParams();

  // Auth and loading state
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // User profile state
  const [username, setUsername] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Collections state
  const [collections, setCollections] = useState([]);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  console.log("User", user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    getDoc(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUsername(data.username || "");
        setAvatarURL(data.avatarURL || "");
      }
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const colRef = collection(db, "users", uid, "collections");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const colls = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCollections(colls);
    });
    return () => unsubscribe();
  }, [uid]);

  // ✅ Conditional rendering happens AFTER hooks
  if (authLoading) return <p className="p-6 text-gray-700">Loading user data...</p>;
  if (!currentUser || currentUser.uid !== uid) {
    return <p className="p-6 text-red-600 font-semibold">Access denied.</p>;
  }

  // Add a new collection
  const handleAddCollection = async () => {
    if (!newCollectionTitle.trim()) return;
    await createNewCollection(uid, newCollectionTitle);
    setNewCollectionTitle("");
  };

  return (
    <div>
        <Navbar />
         <main className="min-h-screen max-w-3xl mx-auto bg-white p-8 rounded shadow-md mt-10">
        
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Edit Your Profile</h1>

      <section className="mb-10">
        <label className="block text-gray-700 font-semibold mb-2">Username</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
        />

        <label className="block text-gray-700 font-semibold mb-2">Profile Picture</label>
        {avatarURL ? (
          <img
            src={avatarURL}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mb-4"
        />
{/* 
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition"
        >
          Save Changes
        </button> */}
      </section>

      <hr className="border-gray-300 my-8" />

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Your Collections</h2>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCollectionTitle}
            onChange={(e) => setNewCollectionTitle(e.target.value)}
            placeholder="New collection name"
            className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddCollection}
            className="bg-green-600 hover:bg-green-700 text-white px-5 rounded transition"
          >
            Add
          </button>
        </div>

        {collections.length > 0 ? (
          <ul className="space-y-3">
            {collections.map((col) => (
              <li
                key={col.id}
                className="p-4 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition"
                title={col.description || ""}
              >
                <strong className="text-gray-900">{col.title}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">You have no collections yet.</p>
        )}
      </section>
    </main>
    </div>
   
  );
}
