'use client';

import { useRouter } from 'next/navigation';
import Navbar from './components/navbar';

const museumsList = [
  {
    name: "Victoria and Albert Museum",
    slug: "VandA",
    logo: "https://i.pinimg.com/originals/b1/8f/49/b18f49a0429f1f1c31dd34a67a225238.jpg",
    background: "https://thecitylane.com/wp-content/uploads/2016/09/IMG_0675.jpg",
  },
  {
    name: "Harvard Art Museums",
    slug: "Harvard",
    logo: "https://1000logos.net/wp-content/uploads/2017/02/Harvard-Logo.png",
    background: "http://4.bp.blogspot.com/-e9bUEPvkzbg/Tha7GtBxj4I/AAAAAAAAI3k/QcgT3HpwUp8/s1600/Harvard%2BUniversity%2BUSA%2BWallpapers%2Bby%2Bcool%2Bwallpapers%2B%25281%2529.jpg",
  },

];

export default function Home() {
  const router = useRouter();

  const handleClick = (museum) => {
    router.push(`/browse?museum=${museum.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="px-6 py-16 text-center mt-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-10">
          {`Explore the World's Greatest Museums`}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
          Discover stunning collections from top institutions across the globe. Click on a museum to start your journey through art and history.
        </p>

        <div className="flex flex-wrap justify-center gap-24">
          {museumsList.map((museum) => (
            <button
              key={museum.slug}
              onClick={() => handleClick(museum)}
              className="relative group w-full max-w-xs h-64 rounded-2xl overflow-hidden shadow-md border border-gray-300 dark:border-gray-700"
              style={{
                backgroundImage: `url(${museum.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay with transition */}
              <div className="absolute inset-0 bg-white/90 dark:bg-zinc-800/80 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:bg-white/60 dark:group-hover:bg-zinc-800/60">
                <img
                  src={museum.logo}
                  alt={`${museum.name} Logo`}
                  className="w-20 h-20 object-contain mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center group-hover:text-blue-500 transition-colors duration-300">
                  {museum.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
