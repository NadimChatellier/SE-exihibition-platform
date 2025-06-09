"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { createNewCollection } from "@/lib/firebaseHelpers/helpers";
import Navbar from "@/app/components/navbar";

const db = getFirestore();

export default function UserPage() {
  const { uid } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [manageMode, setManageMode] = useState(false);
  const toggleManageMode = () => setManageMode((prev) => !prev);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

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

  if (authLoading) return <p className="p-6 text-gray-700">Loading...</p>;
  if (!currentUser || currentUser.uid !== uid) {
    return <p className="p-6 text-red-600 font-semibold">Access denied.</p>;
  }

  const handleAddCollection = async () => {
    if (!newCollectionTitle.trim()) return;
    await createNewCollection(uid, newCollectionTitle);
    setNewCollectionTitle("");
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm("Delete this collection?")) return;
    await deleteDoc(doc(db, "users", uid, "collections", collectionId));
  };

  const handleDeleteArtwork = async (collectionId, artToRemove) => {
    if (!window.confirm(`Delete "${artToRemove.title}"?`)) return;
    const colRef = doc(db, "users", uid, "collections", collectionId);
    await updateDoc(colRef, {
      artworks: arrayRemove(artToRemove),
    });
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen max-w-3xl mx-auto bg-white p-8 rounded shadow-md mt-20">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">Your Collections</h2>
            <button
  onClick={toggleManageMode}
  className="relative inline-block px-5 py-2 font-semibold text-blue-600 group focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-md
             before:absolute before:inset-0 before:rounded-md before:bg-blue-100 before:opacity-0 before:transition-opacity
             hover:before:opacity-50
             active:scale-95 transition-transform"
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
  className="relative inline-block px-6 py-2 font-bold text-white rounded-md bg-green-500 shadow-lg
             hover:from-green-600 hover:to-green-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300
             transition-transform transform"
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
              className="relative inline-block px-4 py-1 font-semibold text-white rounded-md bg-gradient-to-r from-red-600 to-red-700 shadow-md
                         hover:from-red-700 hover:to-red-800 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300
                         transition-transform transform"
            >
              Delete Collection
            </button>
                  ) : (
                    <Link
                    href={`/collection/${uid}/${col.id}`}
                    className="inline-block px-5 py-1.5 text-sm font-medium text-blue-600 border border-blue-500 rounded-md hover:bg-blue-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                  >
                    View Collection
                  </Link>
                  
                  )}
                </div>

                {manageMode ? (
                  <div className="space-y-2">
                    {col.artworks?.length ? (
                      col.artworks.map((art, idx) => (
                        <div key={idx} className="flex items-center gap-4 border rounded-md p-2">
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
