import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function KastratInfo() {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-bg min-h-screen flex flex-col items-center pt-8 px-4 md:px-8 relative">
      
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate('/')}
        className="absolute left-4 md:left-8 top-8 flex items-center gap-2 text-brand-blue hover:text-brand-green transition-colors"
      >
        <ArrowLeft size={24} />
        <span className="font-agrandir hidden md:inline">Kembali</span>
      </button>

      {/* Header Logos */}
      <div className="flex gap-4 md:gap-8 mb-10 mt-12 md:mt-0">
        <img src="/images/logo-hima.png" alt="Logo HIMA K3" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        <img src="/images/logo-adyanala.png" alt="Adyanala" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
      </div>

      {/* Main Title */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="font-sturoc text-brand-green text-6xl md:text-8xl text-center drop-shadow-md leading-none">
          HALO, HIM!
        </h1>
        <h2 className="font-sturoc text-brand-blue text-4xl md:text-6xl text-center mt-2 tracking-widest drop-shadow-sm">
          KA-STRAT
        </h2>
      </div>

      {/* Description Box */}
      <div className="bg-[#2ca352] p-6 md:p-8 border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-full max-w-4xl mb-8">
        <p className="font-agrandir text-white text-base md:text-xl text-justify md:text-center leading-relaxed">
          Form Aspirasi Mahasiswa D4 - Keselamatan dan Kesehatan Kerja Fakultas Vokasi Universitas Airlangga ini ditujukan sebagai wadah bagi seluruh mahasiswa Program Studi D4 - K3 UNAIR. Dengan adanya aspirasi ini, diharapkan dapat tercipta komunikasi yang terbuka serta mendorong terciptanya lingkungan akademik yang lebih kondusif terhadap kebutuhan mahasiswa K3.
        </p>
      </div>

      {/* Call to Action */}
      <Link 
        to="/kastrat/form" 
        className="font-agrandir text-brand-blue text-xl md:text-2xl underline hover:text-brand-green transition-colors"
      >
        Isi Formulir
      </Link>
    </div>
  );
}