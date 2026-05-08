export function Footer() {
  return (
    <footer className="w-full bg-[#3a3a3a] text-white mt-auto border-t-4 border-brand-green">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 text-center font-agrandir">
        <p className="text-sm md:text-base text-white mb-1">
          © {new Date().getFullYear()} Departemen Media dan Informasi
        </p>
        <p className="text-xs md:text-sm text-white/80">
          Himpunan Mahasiswa D4 Keselamatan dan Kesehatan Kerja
        </p>
        <p className="text-xs md:text-sm text-white/80 mb-3">
          Kabinet Adyanala - Universitas Airlangga
        </p>
        <a
          href="/admin/login"
          className="inline-block text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          Admin Login
        </a>
      </div>
    </footer>
  );
}
