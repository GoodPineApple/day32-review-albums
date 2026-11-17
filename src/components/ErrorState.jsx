import { Link } from "react-router";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ErrorState({ message, to = "/albums", linkText = "앨범 목록으로" }) {
  function handleRetry() { window.location.reload(); }
  return (
    <Card role="alert" className="max-w-xl">
      <CardHeader><Badge variant="destructive">불러오기 실패</Badge><h1 className="mt-2 text-xl font-semibold">데이터를 표시할 수 없습니다</h1></CardHeader>
      <CardContent className="space-y-4"><p className="break-words text-muted-foreground">{message}</p><div className="flex flex-wrap gap-2"><Button onClick={handleRetry}>다시 시도</Button><Button asChild variant="outline"><Link to={to}>{linkText}</Link></Button></div></CardContent>
    </Card>
  );
}
export default ErrorState;
