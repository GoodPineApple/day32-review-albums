import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PhotoCard from "@/components/PhotoCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API = "https://jsonplaceholder.typicode.com";

function AlbumPage({ favorites, onToggleFavorite }) {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadAlbum() {
      setLoading(true);
      setMessage("");
      setAlbum(null);
      setPhotos([]);
      try {
        if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > 100) throw new Error("존재하지 않는 앨범입니다. 1–100번 중 선택해 주세요.");
        const response = await fetch(`${API}/albums/${id}`, { signal: controller.signal });
        if (response.status === 404) throw new Error("존재하지 않는 앨범입니다.");
        if (!response.ok) throw new Error(`앨범을 받지 못했습니다 (${response.status}).`);
        const albumData = await response.json();
        if (!albumData.id) throw new Error("존재하지 않는 앨범입니다.");
        const photoResponse = await fetch(`${API}/photos?albumId=${id}`, { signal: controller.signal });
        if (!photoResponse.ok) throw new Error(`사진 목록을 받지 못했습니다 (${photoResponse.status}).`);
        const photoData = await photoResponse.json();
        if (controller.signal.aborted) return;
        setAlbum(albumData);
        setPhotos(photoData);
        setMessage("");
      } catch (error) {
        if (!controller.signal.aborted) setMessage(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadAlbum();
    // 빠르게 다른 앨범으로 이동할 때 이전 응답이 새 화면을 덮지 않게 합니다.
    return () => controller.abort();
  }, [id]);

  function handleToggleFavorite() { onToggleFavorite(album); }

  if (loading) return <LoadingState message="앨범과 사진을 불러오는 중…" />;
  if (message) return <ErrorState message={message} />;
  if (!album) return <ErrorState message="앨범 정보가 없습니다." />;
  const isFavorite = favorites.some((item) => item.id === album.id);

  return (
    <article className="space-y-8">
      <Button asChild variant="outline" className="h-11"><Link to="/albums">← 앨범 목록으로</Link></Button>
      <header className="space-y-4 border-b pb-8"><p className="eyebrow">ALBUM / {String(album.id).padStart(3, "0")}</p><h1 className="page-title break-words">{album.title}</h1><div className="flex flex-wrap items-center gap-3"><Badge variant="secondary">사용자 {album.userId}</Badge><Badge variant="outline">사진 {photos.length}장</Badge><Button className="h-11" variant={isFavorite ? "secondary" : "default"} aria-pressed={isFavorite} onClick={handleToggleFavorite}>{isFavorite ? "✓ 보관 중 · 관심 해제" : "관심 앨범에 추가"}</Button></div></header>
      <section className="space-y-5"><h2 className="text-xl font-semibold">앨범 속 사진 <span className="text-muted-foreground">{photos.length}</span></h2>
        {photos.length === 0 && <p className="text-muted-foreground">이 앨범에는 아직 사진이 없습니다.</p>}
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{photos.map((photo) => <li key={photo.id} className="min-w-0"><PhotoCard photo={photo} /></li>)}</ul>
      </section>
    </article>
  );
}
export default AlbumPage;
