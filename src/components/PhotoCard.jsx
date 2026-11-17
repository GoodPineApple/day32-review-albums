import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

function PhotoCard({ photo }) {
  function handleImageError(event) {
    // 실패한 이미지를 숨겨도 뒤에 있는 안내와 고정 비율은 그대로 남습니다.
    event.currentTarget.hidden = true;
  }
  return (
    <Link to={`/photos/${photo.id}`} className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-primary">
      <Card className="h-full gap-0 py-0 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-muted-foreground">사진 #{photo.id}<br />이미지를 표시할 수 없을 수 있습니다</div>
          <img className="relative size-full object-cover" src={photo.thumbnailUrl} alt={photo.title} loading="lazy" onError={handleImageError} />
        </div>
        <CardContent className="space-y-2 py-4"><p className="font-mono text-xs text-muted-foreground">PHOTO / {photo.id}</p><h3 className="text-sm font-medium break-words group-hover:underline">{photo.title}</h3></CardContent>
      </Card>
    </Link>
  );
}
export default PhotoCard;
