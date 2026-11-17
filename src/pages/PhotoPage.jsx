import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API = "https://jsonplaceholder.typicode.com";

function PhotoPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadPhoto() {
      setLoading(true);
      setPhoto(null);
      setMessage("");
      try {
        if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) throw new Error("유효한 사진 번호를 입력해 주세요.");
        const response = await fetch(`${API}/photos/${id}`, { signal: controller.signal });
        if (response.status === 404) throw new Error("존재하지 않는 사진입니다.");
        if (!response.ok) throw new Error(`사진을 받지 못했습니다 (${response.status}).`);
        const data = await response.json();
        if (!data.id) throw new Error("존재하지 않는 사진입니다.");
        if (controller.signal.aborted) return;
        setPhoto(data);
        setMessage("");
      } catch (error) {
        if (!controller.signal.aborted) setMessage(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadPhoto();
    return () => controller.abort();
  }, [id]);

  function handleImageError(event) { event.currentTarget.hidden = true; }

  if (loading) return <LoadingState message="사진을 불러오는 중…" />;
  if (message) return <ErrorState message={message} />;
  if (!photo) return <ErrorState message="사진 정보가 없습니다." />;

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="outline" className="h-11"><Link to={`/albums/${photo.albumId}`}>← 원래 앨범으로 돌아가기</Link></Button>
      <div className="space-y-3"><p className="eyebrow">PHOTO / {photo.id}</p><h1 className="page-title break-words">{photo.title}</h1><div className="flex gap-2"><Badge variant="secondary">사진 ID {photo.id}</Badge><Badge variant="outline">앨범 ID {photo.albumId}</Badge></div></div>
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
        <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-muted-foreground">이미지를 표시할 수 없습니다.<br />사진 제목과 앨범 정보는 위에서 확인할 수 있습니다.</p>
        <img key={photo.id} src={photo.url} alt={photo.title} className="relative size-full object-contain" onError={handleImageError} />
      </div>
    </article>
  );
}
export default PhotoPage;
