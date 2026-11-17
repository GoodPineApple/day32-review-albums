import { Card, CardHeader, CardContent } from "@/components/ui/card";

function LoadingState({ message = "앨범을 불러오는 중…" }) {
  return (
    <div role="status" aria-live="polite" className="space-y-5">
      <p className="text-muted-foreground">{message}</p>
      <div aria-hidden="true" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((id) => <Card key={id} className="motion-safe:animate-pulse"><CardHeader><div className="h-5 w-1/3 rounded bg-muted" /></CardHeader><CardContent><div className="h-20 rounded bg-muted" /></CardContent></Card>)}
      </div>
    </div>
  );
}
export default LoadingState;
