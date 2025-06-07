"use client";
import Link from "next/link";
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
  deleteDoc,
  updateDoc, 
  arrayRemove
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
  const [manageMode, setManageMode] = useState(false);
const toggleManageMode = () => setManageMode((prev) => !prev);

// Delete collection
const handleDeleteCollection = async (collectionId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this collection?");
  if (!confirmDelete) return;
  await deleteDoc(doc(db, "users", uid, "collections", collectionId));
};

// Delete artwork from collection
const handleDeleteArtwork = async (collectionId, artToRemove) => {
  const confirmDelete = window.confirm(`Delete artwork "${artToRemove.title}"?`);
  if (!confirmDelete) return;

  const colRef = doc(db, "users", uid, "collections", collectionId);
  await updateDoc(colRef, {
    artworks: arrayRemove(artToRemove),
  });
};

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
      console.log(colls)
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
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl font-semibold text-gray-900">Your Collections</h2>
    <button
      onClick={toggleManageMode}
      className="text-sm font-medium text-blue-600 hover:underline"
    >
      {manageMode ? "Exit Manage Mode" : "Manage Collections"}
    </button>
  </div>

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

  <div className="grid gap-6">
    {collections.map((col) => (
      <div
        key={col.id}
        className="p-4 border border-gray-300 rounded bg-white transition hover:shadow-sm"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{col.title}</h3>
          {manageMode ? (
            <button
              onClick={() => handleDeleteCollection(col.id)}
              className="text-red-600 text-sm hover:underline"
            >
              Delete Collection
            </button>
          ) : (
            <Link
              href={`/collection/${uid}/${col.id}`}
              className="text-blue-600 text-sm hover:underline"
            >
              View Collection
            </Link>
          )}
        </div>

        {manageMode ? (
          <div className="space-y-2">
            {col.artworks?.length ? (
              col.artworks.map((art, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border rounded-md p-2"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{art.title}</p>
                    <p className="text-sm text-gray-500">{art.artist}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteArtwork(col.id, art)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No artworks yet.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {col.artworks?.slice(0, 4).map((art, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition">
                  {art.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</section>

    </main>
    </div>
   
  );
}
