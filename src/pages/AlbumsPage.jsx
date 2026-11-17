import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import AlbumFilters from "@/components/AlbumFilters";
import AlbumGrid from "@/components/AlbumGrid";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const API = "https://jsonplaceholder.typicode.com";

function AlbumsPage({ favorites, onToggleFavorite }) {
  const [albums, setAlbums] = useState(null);
  const [message, setMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const userId = searchParams.get("userId") || "";

  useEffect(() => {
    const controller = new AbortController();
    async function loadAlbums() {
      try {
        const response = await fetch(`${API}/albums`, { signal: controller.signal });
        if (!response.ok) throw new Error(`앨범 목록을 받지 못했습니다 (${response.status}).`);
        const data = await response.json();
        if (controller.signal.aborted) return;
        setAlbums(data);
        setMessage("");
      } catch (error) {
        if (!controller.signal.aborted) setMessage(`앨범을 불러오지 못했습니다. 네트워크 연결을 확인해 주세요. ${error.message}`);
      }
    }
    loadAlbums();
    return () => controller.abort();
  }, []);

  function handleChangeFilter(name, value) {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(name, value);
    else nextParams.delete(name);
    setSearchParams(nextParams, { replace: true });
  }
  function handleResetFilters() { setSearchParams({}); }

  if (message) return <ErrorState message={message} to="/" linkText="홈으로" />;
  if (!albums) return <LoadingState />;

  // 검색은 받은 데이터에서 계산하므로 입력할 때마다 API를 다시 호출하지 않습니다.
  const visibleAlbums = albums.filter((album) =>
    (!userId || String(album.userId) === userId) && album.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const userIds = [...new Set(albums.map((album) => album.userId))];

  return (
    <section className="space-y-7">
      <div><p className="eyebrow">THE COLLECTION</p><h1 className="page-title">앨범 탐색</h1><p className="mt-3 text-muted-foreground">제목으로 찾고, 사진을 살펴보고, 마음에 드는 앨범을 보관하세요.</p></div>
      <AlbumFilters query={query} userId={userId} userIds={userIds} onChangeFilter={handleChangeFilter} onReset={handleResetFilters} />
      <p role="status" className="flex items-center gap-2 text-sm">검색 결과 <Badge variant="secondary">{visibleAlbums.length}개</Badge><span className="text-muted-foreground">전체 {albums.length}개 앨범</span></p>
      {visibleAlbums.length > 0 && <AlbumGrid albums={visibleAlbums} favorites={favorites} onToggleFavorite={onToggleFavorite} />}
      {visibleAlbums.length === 0 && <Card><CardContent className="space-y-4 py-8 text-center"><h2 className="text-lg font-semibold">검색 결과가 없습니다</h2><p className="text-muted-foreground">다른 제목이나 사용자 번호로 찾아보세요.</p><Button variant="outline" onClick={handleResetFilters}>필터 초기화</Button></CardContent></Card>}
    </section>
  );
}
export default AlbumsPage;
