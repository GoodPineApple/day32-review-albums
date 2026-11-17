import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Bookmark, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function HomePage() {
  const [albumId, setAlbumId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleIdChange(event) { setAlbumId(event.target.value); setMessage(""); }
  function handleSubmit(event) {
    event.preventDefault();
    const number = Number(albumId);
    if (!/^\d+$/.test(albumId.trim()) || !Number.isInteger(number) || number < 1 || number > 100) {
      setMessage("1부터 100까지의 정수 앨범 번호를 입력해 주세요.");
      return;
    }
    setMessage("");
    navigate(`/albums/${number}`);
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-10 rounded-2xl border bg-secondary/50 p-6 md:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="space-y-6">
          <Badge variant="outline">공개 앨범 탐색 서비스</Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">발견하고,<br /><span className="text-primary">마음에 담아두세요.</span></h1>
          <p className="max-w-md leading-relaxed text-muted-foreground">Album Archive에서 앨범 속 사진을 둘러보고,<br className="hidden sm:block" /> 다시 보고 싶은 컬렉션을 관심 앨범으로 모아보세요.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-11 px-5"><Link to="/albums">전체 앨범 보기<ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline" className="h-11 px-5"><Link to="/favorites">관심 앨범 보기</Link></Button>
          </div>
        </div>
        <Card className="shadow-sm">
          <CardHeader><p className="font-mono text-xs tracking-widest text-primary">QUICK EXPLORER</p><h2 className="mt-2 text-xl font-semibold">번호로 바로 열기</h2><p id="id-help" className="text-muted-foreground">유효한 앨범 번호: 1–100</p></CardHeader>
          <CardContent>
            <form noValidate onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="album-id" className="text-sm font-medium">앨범 번호</label>
              <div className="flex gap-2"><Input id="album-id" inputMode="numeric" placeholder="예: 1" value={albumId} onChange={handleIdChange} aria-invalid={Boolean(message)} aria-describedby={message ? "id-help id-error" : "id-help"} className="h-11" /><Button type="submit" className="h-11">이동<ArrowRight aria-hidden="true" /></Button></div>
              {message && <p id="id-error" role="alert" className="text-sm text-destructive">{message}</p>}
            </form>
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-5 md:grid-cols-2" aria-label="주요 기능">
        <Card><CardHeader><Grid2X2 className="mb-3 text-primary" aria-hidden="true" /><h2 className="text-lg font-semibold">나만의 탐색 방식</h2></CardHeader><CardContent className="leading-relaxed text-muted-foreground">제목과 사용자 번호로 앨범을 찾으세요. 검색 주소를 복사하면 같은 탐색 화면을 다시 열 수 있습니다.</CardContent></Card>
        <Card><CardHeader><Bookmark className="mb-3 text-primary" aria-hidden="true" /><h2 className="text-lg font-semibold">가볍게 모으는 관심 앨범</h2></CardHeader><CardContent className="leading-relaxed text-muted-foreground">마음에 드는 앨범을 한곳에 모아보세요. 관심 목록은 현재 방문 중에 유지되며, 새로고침하면 초기화됩니다.</CardContent></Card>
      </section>
    </div>
  );
}
export default HomePage;
