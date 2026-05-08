import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-bg min-h-screen w-full font-agrandir overflow-x-hidden">
      
      {/* SECTION 1: COVER (Layar Pertama) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8">
        
        {/* Logo diletakkan absolut di bagian atas */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-6 md:gap-10">
          <img src="/images/logo-hima.png" alt="Logo HIMA K3" className="w-16 h-16 md:w-24 md:h-24 object-contain" />
          <img src="/images/logo-adyanala.png" alt="Adyanala" className="w-16 h-16 md:w-24 md:h-24 object-contain" />
        </div>

        {/* Tulisan Besar di Tengah */}
        <h1 className="font-sturoc text-brand-green text-7xl md:text-9xl lg:text-[140px] text-center drop-shadow-md tracking-wider mt-12">
          HALO, HIM!
        </h1>

        {/* Indikator Scroll di Bawah */}
        <div className="absolute bottom-12 flex flex-col items-center text-brand-blue animate-bounce opacity-70">
          <span className="text-sm md:text-base tracking-widest mb-2 font-bold">SCROLL</span>
          <ChevronDown size={32} />
        </div>
      </section>

      {/* SECTION 2: DESKRIPSI & PILIHAN (Layar Kedua) */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-20 bg-[#f4ebda]">
        
        {/* Kotak Deskripsi */}
        <div className="bg-brand-blue p-8 md:p-12 border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] w-full max-w-5xl mb-16">
          <p className="font-agrandir text-white text-lg md:text-2xl text-justify md:text-center leading-relaxed">
            "Halo, Him!" merupakan suatu program kerja kolaboratif antara Departemen Hubungan Luar (HUBLU) 
            dengan Dewan Pengawas Himpunan (DPH) yang berfungsi sebagai sebuah wadah komunikasi, pengaduan, 
            dan penyaluran aspirasi mahasiswa serta para anggota organisasi dalam lingkup Program Studi 
            D4 - Keselamatan dan Kesehatan Kerja, Fakultas Vokasi, Universitas Airlangga.
          </p>
        </div>

        {/* Tombol Pilihan Jaras dan Kastrat */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          <button 
            onClick={() => navigate('/kastrat')}
            className="flex-1 bg-brand-green border-4 border-white py-8 px-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 group"
          >
            <span className="font-sturoc text-white text-5xl md:text-6xl tracking-widest group-hover:drop-shadow-md">
              KA-STRAT
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/jaras')}
            className="flex-1 bg-brand-green border-4 border-white py-8 px-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 group"
          >
            <span className="font-sturoc text-white text-5xl md:text-6xl tracking-widest group-hover:drop-shadow-md">
              JARAS
            </span>
          </button>
        </div>
      </section>
      
    </div>
  );
}