"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { addArtworkToCollection, createNewCollection } from "@/lib/firebaseHelpers/helpers";

const db = getFirestore();

export default function CollectionModal({ isOpen, onClose, artwork }) {
  const [collections, setCollections] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const colRef = collection(db, "users", uid, "collections");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCollections(data);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleSelect = async (col) => {
    const uid = auth.currentUser?.uid;
    if (!uid || !artwork) return;

    try {
      await addArtworkToCollection(uid, col.id, artwork);
      onClose();
    } catch (err) {
      console.error("Failed to add artwork:", err);
    }
  };

  const handleCreate = async (title) => {
    const uid = auth.currentUser?.uid;
    if (!uid || !title) return;

    try {
      await createNewCollection(uid, title, artwork); // Note: we’ll update this helper too
      setNewTitle("");
      onClose();
    } catch (err) {
      console.error("Failed to create collection:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Add to Collection</h2>

        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {collections.length > 0 ? (
            collections.map((col) => (
              <button
                key={col.id}
                onClick={() => handleSelect(col)}
                className="w-full text-left px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                {col.title}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No collections yet.</p>
          )}
        </div>

        <hr className="my-4" />

        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New collection name"
            className="flex-grow p-2 border rounded border-gray-300 dark:bg-zinc-800"
          />
          <button
            onClick={() => handleCreate(newTitle.trim())}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
