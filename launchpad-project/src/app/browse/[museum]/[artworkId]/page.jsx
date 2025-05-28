'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchHarvardArtworkById, fetchVandAArtworkById } from '@/lib/API/requests';
import Navbar from '@/app/components/navbar';

export default function ArtworkDetailClient() {
  const { museum, artworkId } = useParams();
  const [art, setArt] = useState(null);
  const [visible, setVisible] = useState(false);
const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!museum || !artworkId) return;

      let data;
      if (museum === "harvard") {
        console.log("passing this id: ", artworkId)
        data = await fetchHarvardArtworkById(artworkId);
      } else if (museum === "vam") {
        data = await fetchVandAArtworkById(artworkId);
      } else if (museum === "BritishMuseum") {
        data = await fetchBritishMuseumArtworkById(artworkId);
      }
      setArt(data);
      setVisible(true);
    }
    load();
  }, [museum, artworkId]);

  if (!art) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (<>
  <Navbar></Navbar>
   <main
      className={`max-w-4xl mx-auto my-12 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl shadow-2xl
        transition-opacity duration-700 ease-in-out
        ${visible ? 'opacity-100' : 'opacity-0'}`}
    >

      {/* Image & Title */}
      {art.image && (
        <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-8 cursor-pointer" onClick={() => setModalOpen(true)}>
          <img
            src={art.image}
            alt={art.title}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-2xl">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">{art.title}</h1>
            <p className="text-sm text-gray-300 italic mt-1">{art.date}</p>
          </div>
        </div>
      )}

     {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={art.image}
              alt={art.title}
              className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // prevent modal close on image click
            />
            <button
              className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
              onClick={() => setModalOpen(false)}
              aria-label="Close image modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Details Section */}
      <section className="space-y-6 text-gray-800">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-lg">
          <DetailItem label="Type" value={art.type} icon="🎨" />
          <DetailItem label="Place of Origin" value={art.place} icon="🌍" />
          <DetailItem label="Creator" value={art.creator} icon="👤" />
          <DetailItem label="Materials & Techniques" value={art.materials} icon="🛠️" isHtml />
        </div>

        {/* Description */}
        <article className="prose prose-indigo max-w-none leading-relaxed text-lg">
          <h2 className="text-2xl font-semibold mb-3">Description</h2>
          <p className="whitespace-pre-wrap">{art.description}</p>
        </article>
      </section>
    </main>
  </>
   
  );
}

function DetailItem({ label, value, icon, isHtml = false }) {
  return (
    <div>
      <h3 className="font-semibold text-indigo-700 flex items-center mb-1">
        <span className="mr-2 text-xl">{icon}</span>
        {label}
      </h3>
      {isHtml ? (
        <div
          className="prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: value || 'Unknown' }}
        />
      ) : (
        <p>{value || 'Unknown'}</p>
      )}
    </div>
  );
}
