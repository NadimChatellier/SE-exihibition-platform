"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Navbar from "@/app/components/navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

const db = getFirestore();

export default function CollectionPage() {
  const { uid, collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      const docRef = doc(db, "users", uid, "collections", collectionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCollection(docSnap.data());
      }
      setLoading(false);
    };

    if (uid && collectionId) fetchCollection();
  }, [uid, collectionId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <DotLottieReact
          src="https://lottie.host/2def65ab-c928-42b9-8832-1443e943516f/9zSNgMlMX6.lottie"
          loop
          autoplay
          style={{ width: 400, height: 400 }}
        />
        <p className="text-lg text-gray-300 mt-4">Loading works of art...</p>
      </div>
    );

  if (!collection)
    return <p className="p-6 text-red-600">Collection not found.</p>;

  const bannerImage = collection.artworks?.[0]?.image;
  console.log(collection)

  return (
    <>
    <Navbar />
    <div className="relative min-h-screen">
      

      {/* Background Blur */}
      {bannerImage && (
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center blur-xl opacity-30"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
      )}

      {/* Hero */}
      <div className="relative z-10 py-20 px-6 text-center text-white bg-gradient-to-b from-black/60 to-transparent">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-md">{collection.title}</h1>
      </div>

      {/* Grid of Artworks */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collection.artworks?.map((art, idx) => (
            <Link href={`/browse/${art.source}/${art.id}`} key={idx}>
              <div className="group bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition duration-200 cursor-pointer">
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover transition group-hover:scale-105 duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg truncate">{art.title}</h2>
                  <p className="text-sm text-gray-500 italic truncate">{art.artist}</p>
                  <p className="text-sm text-gray-400">{art.date}</p>
                  <p className="text-xs mt-2 text-right uppercase tracking-widest text-gray-400">
                    {art.source}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div></>
    
  );
}
