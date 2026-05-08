import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-agrandir">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
