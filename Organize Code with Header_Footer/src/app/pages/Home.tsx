import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { PageTransition, FadeInUp } from "../components/PageTransition";

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 md:px-8">
        <motion.button
          onClick={() => navigate("/info")}
          className="group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.h1
            className="font-sturoc text-brand-green text-7xl md:text-9xl lg:text-[140px] text-center drop-shadow-md tracking-wider"
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            HALO, HIM!
          </motion.h1>
        </motion.button>

        <FadeInUp delay={0.2}>
          <p className="font-agrandir text-brand-blue/80 mt-6 text-center max-w-xl">
            Wadah komunikasi, pengaduan, dan penyaluran aspirasi mahasiswa
            D4 Keselamatan dan Kesehatan Kerja, Universitas Airlangga.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <motion.p
            className="font-agrandir text-brand-blue/60 mt-4 text-sm text-center"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Klik "HALO, HIM!" untuk masuk
          </motion.p>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}
