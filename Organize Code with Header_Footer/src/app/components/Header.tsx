import { Link, useLocation } from "react-router";

// Tambahkan ../ sekali lagi agar dia naik ke folder src, baru masuk ke assets
import logoHima from "../../assets/Hm.png";
import logoKabinet from "../../assets/Ad.png";

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur border-b border-black/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex gap-2 items-center">
            
            {/* 2. MENGGANTI LINGKARAN K3 MENJADI GAMBAR LOGO HIMA */}
            <img 
              src={logoHima} 
              alt="Logo HIMA K3" 
              className="w-10 h-10 object-contain drop-shadow-sm hover:scale-105 transition-transform" 
            />

            {/* 3. MENGGANTI LINGKARAN AD MENJADI GAMBAR LOGO KABINET */}
            <img 
              src={logoKabinet} 
              alt="Logo Kabinet" 
              className="w-10 h-10 object-contain drop-shadow-sm hover:scale-105 transition-transform" 
            />

          </div>
        <span className="font-sturoc text-brand-blue text-xl tracking-wider hidden sm:inline ml-1">
  HALO, HIM!
</span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2 font-agrandir">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              isHome ? "text-brand-green" : "text-brand-blue hover:text-brand-green"
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/kastrat"
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              location.pathname.startsWith("/kastrat")
                ? "text-brand-green"
                : "text-brand-blue hover:text-brand-green"
            }`}
          >
            Kastrat
          </Link>
          <Link
            to="/jaras"
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              location.pathname.startsWith("/jaras")
                ? "text-brand-green"
                : "text-brand-blue hover:text-brand-green"
            }`}
          >
            Jaras
          </Link>
        </nav>
      </div>
    </header>
  );
}