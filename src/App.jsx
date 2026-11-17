import { useState } from "react";
import { Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import AlbumsPage from "@/pages/AlbumsPage";
import AlbumPage from "@/pages/AlbumPage";
import PhotoPage from "@/pages/PhotoPage";
import FavoritesPage from "@/pages/FavoritesPage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  const [favorites, setFavorites] = useState([]);

  function handleToggleFavorite(album) {
    setFavorites((previous) => {
      if (previous.some((item) => item.id === album.id)) {
        return previous.filter((item) => item.id !== album.id);
      }
      return [...previous, album];
    });
  }

  return (
    <Routes>
      <Route element={<Layout favoriteCount={favorites.length} />}>
        <Route index element={<HomePage />} />
        <Route path="albums" element={<AlbumsPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="albums/:id" element={<AlbumPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="photos/:id" element={<PhotoPage />} />
        <Route path="favorites" element={<FavoritesPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
export default App;
