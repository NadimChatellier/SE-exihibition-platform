import Link from "next/link";

export default function ArtworkCard({ art }) {
  return (
    <Link href={`/browse/${art.source}/${art.id}`}>
      <div className="group border rounded-2xl shadow p-4 flex flex-col bg-white dark:bg-zinc-900 transition transform hover:scale-[1.02] cursor-pointer">
        <div className="aspect-square mb-4 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden rounded-xl">
          {art.image ? (
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-gray-500 text-center">No Image Available</span>
          )}
        </div>
        <h2 className="text-lg font-semibold truncate">{art.title}</h2>
        <p className="text-sm text-muted-foreground italic">{art.artist}</p>
        <p className="text-sm text-muted-foreground">{art.date}</p>
        <p className="text-xs mt-2 text-right uppercase tracking-wide text-gray-400">{art.source}</p>
      </div>
    </Link>
  );
}
