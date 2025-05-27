"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
const museumsList = [
  {
    name: "Victoria and Albert Museum",
    slug: "VandA",
    logo: "https://i.pinimg.com/originals/b1/8f/49/b18f49a0429f1f1c31dd34a67a225238.jpg",
    institutionImg: "https://thecitylane.com/wp-content/uploads/2016/09/IMG_0675.jpg"
  },
  {
    name: "Harvard University",
    slug: "Harvard",
    logo: "https://1000logos.net/wp-content/uploads/2017/02/Harvard-Logo.png",
    institutionImg: "http://4.bp.blogspot.com/-e9bUEPvkzbg/Tha7GtBxj4I/AAAAAAAAI3k/QcgT3HpwUp8/s1600/Harvard%2BUniversity%2BUSA%2BWallpapers%2Bby%2Bcool%2Bwallpapers%2B%25281%2529.jpg"
  },
  {
    name: "British Museum",
    slug: "BritishMuseum",
    logo: "https://logowik.com/content/uploads/images/the-british-museum3412.logowik.com.webp",
    institutionImg: "https://a.cdn-hotels.com/gdcs/production198/d432/d8d514b2-c526-45dc-aaa4-7839f4765ce0.jpg"
  },
  // {
  //   name: "Musée du Louvre",
  //   slug: "Louvre",
  //   logo: "https://logodix.com/logo/792100.png",
  //   institutionImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/500px-Louvre_Museum_Wikimedia_Commons.jpg"
  // }

];

export default function Home() {
  const [selectedMuseum, setSelectedMuseum] = useState(null);

  const router = useRouter();

 function handleClick(museum) {
  router.push(`/browse?museum=${museum.slug}`);
}


  return (
    <div>
      <Navbar></Navbar>
           <div className="min-h-screen px-8 py-16 sm:px-20 bg-gray-50 dark:bg-gray-900">

      <h1 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">
        Select a Museum to View Their Gallery
      </h1>

      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {museumsList.map((museum) => (
         <button
  key={museum.name}
  onClick={() => handleClick(museum)}
  className="group relative flex flex-col items-center rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 overflow-hidden"
>
  {/* Background image container */}
  <div
    className="absolute inset-0 bg-center bg-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out transform group-hover:scale-105 filter brightness-75 rounded-3xl"
    style={{ backgroundImage: `url(${museum.institutionImg})` }}
  />

  {/* Content container with higher z-index */}
  <div className="relative z-10 flex flex-col items-center">
    <img
      src={museum.logo}
      alt={`${museum.name} Logo`}
      className="w-24 h-24 object-contain mb-4 rounded-lg transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
    />
    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-400 transition-colors duration-300 text-center">
      {museum.name}
    </span>
  </div>
</button>

        ))}
      </div>
    </div>
    </div>

  
   
  );
}
