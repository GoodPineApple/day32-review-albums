import { Link, NavLink, Outlet } from "react-router";
import { Layers } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function menuClass({ isActive }) {
  return cn(buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
    "h-11 px-3", isActive && "font-bold underline underline-offset-8");
}

function Layout({ favoriteCount = 0 }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:p-3">본문으로 건너뛰기</a>
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex w-fit items-center gap-2 text-lg font-bold tracking-tight"><Layers className="size-6 text-primary" aria-hidden="true" />Album Archive<span className="text-primary">.</span></Link>
          <nav aria-label="주 메뉴" className="flex flex-wrap gap-1">
            <NavLink to="/" end className={menuClass}>홈</NavLink>
            <NavLink to="/albums" className={menuClass}>앨범 탐색</NavLink>
            <NavLink to="/favorites" className={menuClass}>관심 앨범 <Badge variant="outline">{favoriteCount}</Badge></NavLink>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 md:py-14"><Outlet /></main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>Album Archive · DAY 28–32 React 복습</p>
          <p>공개 데이터 제공: <a className="underline underline-offset-4" href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noreferrer">JSONPlaceholder</a></p>
        </div>
      </footer>
    </div>
  );
}
export default Layout;
