import { Link } from "react-router";
import AlbumGrid from "@/components/AlbumGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function FavoritesPage({ favorites, onToggleFavorite }) {
  return (
    <section className="space-y-7">
      <div><p className="eyebrow">YOUR COLLECTION</p><h1 className="page-title">나의 관심 앨범</h1><p className="mt-3 flex items-center gap-2 text-muted-foreground">다시 보고 싶은 앨범 <Badge variant="secondary">{favorites.length}개</Badge></p><p className="mt-2 text-sm text-muted-foreground">현재 방문 중에만 보관됩니다. 새로고침하면 초기화됩니다.</p></div>
      {favorites.length > 0 && <AlbumGrid albums={favorites} favorites={favorites} onToggleFavorite={onToggleFavorite} />}
      {favorites.length === 0 && <Card><CardContent className="space-y-4 py-10 text-center"><h2 className="text-xl font-semibold">아직 보관한 앨범이 없습니다</h2><p className="text-muted-foreground">탐색 중 마음에 드는 앨범의 ‘관심 추가’를 눌러보세요.</p></CardContent></Card>}
      <Button asChild className="h-11"><Link to="/albums">전체 앨범 보러 가기 →</Link></Button>
    </section>
  );
}
export default FavoritesPage;
