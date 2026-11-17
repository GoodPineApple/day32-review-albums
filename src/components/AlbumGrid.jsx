import AlbumCard from "@/components/AlbumCard";

function AlbumGrid({ albums, favorites, onToggleFavorite }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => (
        <li key={album.id} className="min-w-0"><AlbumCard album={album} isFavorite={favorites.some((item) => item.id === album.id)} onToggleFavorite={onToggleFavorite} /></li>
      ))}
    </ul>
  );
}
export default AlbumGrid;
