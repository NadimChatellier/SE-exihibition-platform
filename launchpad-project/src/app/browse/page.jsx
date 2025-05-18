"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchVandAArtworks,
  fetchHarvardArtworks,
  fetchBritishMuseumArtworks,
} from "@/lib/API/requests";
import ArtworkCard from "../components/artworkCard";
import Navbar from "../components/navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import {  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis, } from "../helperFunctions/pagination";

const lookupMap = {
  VandA: fetchVandAArtworks,
  Harvard: fetchHarvardArtworks,
  BritishMuseum: fetchBritishMuseumArtworks,
};

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const museumKey = searchParams.get("museum");

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!museumKey || !lookupMap[museumKey]) {
      setError("Museum not found or not supported");
      return;
    }

    setLoading(true);
    setError(null);

    lookupMap[museumKey](page) // ✅ pass page number to fetch
      .then((data) => {
        console.log(data.records)
        setArtworks(data.records);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch artworks");
        setLoading(false);
      });
  }, [museumKey, page]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen px-8 py-16 sm:px-20">
        <h1 className="text-3xl font-bold mb-10 text-center">
          {museumKey ? `Gallery for ${museumKey}` : "Gallery"}
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-screen flex-col">
            <DotLottieReact
              src="https://lottie.host/2def65ab-c928-42b9-8832-1443e943516f/9zSNgMlMX6.lottie"
              loop
              autoplay
              style={{ width: 400, height: 400 }}
            />
            <p className="text-lg text-gray-300 mt-4">
              Loading works of art...
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artworks.map((art) => (
                <ArtworkCard key={art.id} art={art} />
              ))}
            </div>

            {/* ✅ Pagination Below */}
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink isActive href="#">
                    {page}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => p + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}
