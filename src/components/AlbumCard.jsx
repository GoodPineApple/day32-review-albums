import { Link } from "react-router";
import { ArrowUpRight, Bookmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

function AlbumCard({ album, isFavorite = false, onToggleFavorite }) {
  function handleToggleFavorite() { onToggleFavorite(album); }

  return (
    <Card className="h-full transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary">
      <CardHeader>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-sm text-muted-foreground">ALBUM / {String(album.id).padStart(3, "0")}</span>
          <Badge variant="secondary">사용자 {album.userId}</Badge>
        </div>
        <h2 className="text-lg font-semibold leading-snug break-words"><Link className="hover:underline" to={`/albums/${album.id}`}>{album.title}</Link></h2>
      </CardHeader>
      <CardContent className="mt-auto"><p className="text-sm text-muted-foreground">앨범을 열어 사진 컬렉션을 살펴보세요.</p></CardContent>
      <CardFooter className="flex-wrap justify-between gap-2">
        <Button aria-pressed={isFavorite} aria-label={`${album.id}번 앨범 ${isFavorite ? "관심 해제" : "관심 추가"}`} variant={isFavorite ? "default" : "outline"} className="h-11" onClick={handleToggleFavorite}>
          {isFavorite ? <Check aria-hidden="true" /> : <Bookmark aria-hidden="true" />}{isFavorite ? "보관 중 · 해제" : "관심 추가"}
        </Button>
        <Button asChild variant="ghost" className="h-11"><Link to={`/albums/${album.id}`}>앨범 보기<ArrowUpRight aria-hidden="true" /></Link></Button>
      </CardFooter>
    </Card>
  );
}
export default AlbumCard;
