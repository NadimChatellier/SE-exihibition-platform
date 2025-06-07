'use client';
//test
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchHarvardArtworkById, fetchVandAArtworkById } from '@/lib/API/requests';
import Navbar from '@/app/components/navbar';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
      }
      //  else if (museum === "BritishMuseum") {
      //   data = await fetchBritishMuseumArtworkById(artworkId);
      // }
      setArt(data);
      setVisible(true);
    }
    load();
  }, [museum, artworkId]);

  if (!art) return <div className="flex items-center justify-center h-screen flex-col">
            <DotLottieReact
              src="https://lottie.host/2def65ab-c928-42b9-8832-1443e943516f/9zSNgMlMX6.lottie"
              loop
              autoplay
              style={{ width: 400, height: 400 }}
            />
            <p className="text-lg text-gray-300 mt-4">
              Loading works of art...
            </p>
          </div>;

  return (<><Navbar />

<main className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 ease-in-out">

  {/* Hero image */}
{art.image && (
  <div
    className="relative h-[70vh] w-full overflow-hidden group cursor-pointer"
    onClick={() => setModalOpen(true)}
  >
    <img
      src={art.image}
      alt={art.title}
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
    <div className="absolute bottom-10 left-10 z-20 max-w-xl backdrop-blur-sm bg-white/10 dark:bg-black/30 p-6 rounded-xl shadow-xl border border-white/20">
      <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">{art.title}</h1>
      <p className="text-gray-200 italic">{art.date}</p>
    </div>
  </div>
)}

  {/* Modal */}
  {modalOpen && (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all"
      onClick={() => setModalOpen(false)}
    >
      <div className="relative max-w-5xl max-h-[90vh]">
        <img
          src={art.image}
          alt={art.title}
          className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          className="absolute top-3 right-3 text-white bg-black/60 hover:bg-black/80 rounded-full p-2"
          onClick={() => setModalOpen(false)}
        >
          ✕
        </button>
      </div>
    </div>
  )}

  {/* Detail section */}
  <section className="max-w-5xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
      <DetailItem label="Type" value={art.type} icon="🎨" />
      <DetailItem label="Place of Origin" value={art.place} icon="🌍" />
      <DetailItem label="Creator" value={art.creator} icon="👤" />
      <DetailItem label="Materials & Techniques" value={art.materials} icon="🛠️" isHtml />
    </div>

    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-4">Description</h2>
      <p className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-200">{art.description}</p>
    </div>
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
