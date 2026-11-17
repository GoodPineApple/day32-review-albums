import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AlbumFilters({ query, userId, userIds, onChangeFilter, onReset }) {
  function handleQueryChange(event) { onChangeFilter("query", event.target.value); }
  function handleUserChange(event) { onChangeFilter("userId", event.target.value); }
  const isUnknownUser = userId && !userIds.some((id) => String(id) === userId);

  return (
    <div className="grid items-end gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_auto_auto]">
      <label className="space-y-2 text-sm font-medium">앨범 제목 검색
        <Input type="search" className="mt-2 h-11" placeholder="어떤 앨범을 찾으세요?" value={query} onChange={handleQueryChange} />
      </label>
      <label className="text-sm font-medium">사용자 번호
        <select className="mt-2 block h-11 w-full rounded-lg border bg-background px-3 sm:w-40" value={userId} onChange={handleUserChange}>
          <option value="">전체 사용자</option>
          {isUnknownUser && <option value={userId}>알 수 없는 번호 ({userId})</option>}
          {userIds.map((id) => <option key={id} value={id}>사용자 {id}</option>)}
        </select>
      </label>
      <Button variant="outline" className="h-11" onClick={onReset} disabled={!query && !userId}>필터 초기화</Button>
    </div>
  );
}
export default AlbumFilters;
