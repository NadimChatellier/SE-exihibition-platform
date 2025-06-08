"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CollectionModal from "./collectionModal"; // Adjust path if needed
import { auth } from "@/lib/firebase";

export default function ArtworkCard({ art, collections = [], onAddToCollection }) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set user on initial render
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSelect = (collection) => {
    onAddToCollection(art, collection);
    setShowModal(false);
  };

  const handleCreate = async (title) => {
    const newCollection = await onAddToCollection(art, null, title);
    setShowModal(false);
  };

  return (
    <>
      <div className="group border rounded-2xl shadow p-4 flex flex-col bg-white dark:bg-zinc-900 transition transform hover:scale-[1.02] cursor-pointer">
        <Link href={`/browse/${art.source}/${art.id}`}>
          <div>
            <div className="aspect-square mb-4 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden rounded-xl">
              {art.image ? (
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-gray-500 text-center">No Image</span>
              )}
            </div>
            <h2 className="text-lg font-semibold truncate">{art.title}</h2>
            <p className="text-sm text-muted-foreground italic">{art.artist}</p>
            <p className="text-sm text-muted-foreground">{art.date}</p>
            <p className="text-xs mt-2 text-right uppercase tracking-wide text-gray-400">
              {art.source}
            </p>
          </div>
        </Link>

        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Add to Collection
          </button>
        )}
      </div>

      <CollectionModal
        collections={collections}
        isOpen={showModal}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onClose={() => setShowModal(false)}
        artwork={art}
      />
    </>
  );
}
