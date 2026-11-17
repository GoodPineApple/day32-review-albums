import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-xl"><CardHeader><p className="eyebrow">404 / PAGE NOT FOUND</p><h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1></CardHeader><CardContent className="space-y-5"><p className="text-muted-foreground">주소를 확인하거나 홈에서 다시 탐색해 주세요.</p><Button asChild><Link to="/">홈으로 돌아가기</Link></Button></CardContent></Card>
  );
}
export default NotFoundPage;
