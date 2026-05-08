import { Link } from "react-router";
import { PageTransition, FadeInUp } from "../components/PageTransition";

export default function JarasInfo() {
  return (
    <PageTransition>
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="h-8" />
        
        <div className="flex flex-col items-center mb-10">
          <FadeInUp delay={0.1}>
            <h1 className="font-sturoc text-brand-green text-6xl md:text-8xl text-center leading-none drop-shadow-sm">
              HALO, HIM!
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <h2 className="font-sturoc text-brand-blue text-3xl md:text-5xl text-center mt-2 tracking-widest">
              JARAS
            </h2>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.3}>
          {/* Kotak deskripsi dilebarkan agar tidak terlihat gendut ke bawah */}
          <div className="bg-gradient-to-b from-brand-green-start to-brand-green-end p-5 md:p-6 border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-12">
            <p className="font-agrandir text-white text-base md:text-lg text-justify md:text-center leading-relaxed">
              Form Pengaduan merupakan wadah penyampaian pengaduan terkait kinerja
              baik secara personal fungsionaris maupun program kerja HIMA D4 K3
              Universitas Airlangga.
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <div className="flex justify-center">
            {/* Ukuran teks dikecilkan agar tidak terlalu gede */}
            <Link
              to="/jaras/identity"
              className="font-agrandir text-brand-blue text-base md:text-lg hover:opacity-70 transition-all underline underline-offset-8 decoration-2"
            >
              Lanjut Mengisi Form
            </Link>
          </div>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}