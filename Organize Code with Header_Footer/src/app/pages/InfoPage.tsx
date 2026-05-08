import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { PageTransition, FadeInUp } from "../components/PageTransition";

export default function InfoPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      {/* min-h-[80vh] dan flex-col justify-center ini yang bikin dia ke tengah vertikal */}
      <section className="px-4 md:px-8 min-h-[80vh] flex flex-col justify-center py-12">
        
        {/* Header Judul HALO HIM */}
        <div className="flex flex-col items-center mb-10">
          <FadeInUp delay={0.1}>
            <motion.h1 
              className="font-sturoc text-brand-green text-6xl md:text-8xl text-center leading-none drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              HALO, HIM!
            </motion.h1>
          </FadeInUp>
        </div>

        <div className="max-w-5xl mx-auto w-full">
          <FadeInUp delay={0.3}>
            {/* Kotak Biru Deskripsi */}
            <div className="bg-gradient-to-b from-brand-blue-start to-brand-blue-end p-6 md:p-8 border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] mb-12">
              <p className="font-agrandir text-white text-base md:text-lg text-justify md:text-center leading-relaxed">
                "Halo, Him!" merupakan program kerja kolaboratif antara Departemen
                Hubungan Luar (HUBLU) dengan Dewan Pengawas Himpunan (DPH) yang
                berfungsi sebagai wadah komunikasi, pengaduan, dan penyaluran
                aspirasi mahasiswa serta para anggota organisasi dalam lingkup
                Program Studi D4 - Keselamatan dan Kesehatan Kerja, Fakultas
                Vokasi, Universitas Airlangga.
              </p>
            </div>
          </FadeInUp>

          {/* Tombol Navigasi Hijau Langsing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeInUp delay={0.4}>
              <motion.button
                onClick={() => navigate("/kastrat")}
                className="bg-gradient-to-b from-brand-green-start to-brand-green-end border-4 border-white py-6 px-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] transition-all w-full flex flex-col items-center justify-center"
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-sturoc text-white text-3xl md:text-4xl tracking-widest">
                  KASTRAT
                </span>
                <p className="font-agrandir text-white/80 mt-2 text-sm text-center">
                  Form aspirasi mahasiswa D4 K3
                </p>
              </motion.button>
            </FadeInUp>

            <FadeInUp delay={0.5}>
              <motion.button
                onClick={() => navigate("/jaras")}
                className="bg-gradient-to-b from-brand-green-start to-brand-green-end border-4 border-white py-6 px-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] transition-all w-full flex flex-col items-center justify-center"
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-sturoc text-white text-3xl md:text-4xl tracking-widest">
                  JARAS
                </span>
                <p className="font-agrandir text-white/80 mt-2 text-sm text-center">
                  Form pengaduan kinerja fungsionaris & program kerja
                </p>
              </motion.button>
            </FadeInUp>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}