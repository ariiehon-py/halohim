import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { PageTransition, FadeInUp } from "../components/PageTransition";
import { BackButton } from "../components/BackButton";
import { motion } from "motion/react";

export default function JarasIdentity() {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [nama, setNama] = useState("");
  const [angkatan, setAngkatan] = useState("");

  const handleContinue = () => {
    const identityData = isAnonymous
      ? { nama: "Anonim", angkatan: "-" }
      : { nama, angkatan };

    // Simpan data identitas ke sessionStorage
    sessionStorage.setItem("jaras_identity", JSON.stringify(identityData));
    navigate("/jaras/form");
  };

  const canContinue = isAnonymous || (nama.trim() !== "" && angkatan.trim() !== "");

  return (
    <PageTransition>
      <section className="max-w-2xl mx-auto px-4 md:px-8 py-12">
        <FadeInUp>
          <BackButton to="/jaras" />
        </FadeInUp>

        <div className="h-6" />

        <FadeInUp delay={0.1}>
          <div className="mb-8">
            <h1 className="font-sturoc text-brand-blue text-3xl md:text-5xl tracking-widest">
              IDENTITAS
            </h1>
            <p className="font-agrandir text-brand-blue/70 mt-2">
              Silakan isi identitas Anda atau pilih untuk tetap anonim.
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="bg-white border border-black/10 rounded-lg shadow-sm p-6 md:p-8 space-y-6 font-agrandir">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-blue-start/10 to-brand-blue-end/10 rounded-lg border border-brand-blue/20">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 accent-brand-green cursor-pointer"
              />
              <label htmlFor="anonymous" className="cursor-pointer select-none">
                <span className="font-medium text-brand-blue">
                  Kirim sebagai Anonim
                </span>
                <p className="text-sm text-brand-blue/70 mt-1">
                  Identitas Anda akan disembunyikan
                </p>
              </label>
            </div>

            {!isAnonymous && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    placeholder="Masukkan nama lengkap Anda"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="border-brand-blue/20 focus:border-brand-green"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="angkatan">Angkatan</Label>
                  <Input
                    id="angkatan"
                    placeholder="Contoh: 2023"
                    value={angkatan}
                    onChange={(e) => setAngkatan(e.target.value)}
                    className="border-brand-blue/20 focus:border-brand-green"
                  />
                </div>
              </motion.div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleContinue}
                disabled={!canContinue}
                className="bg-gradient-to-b from-brand-blue-start to-brand-blue-end hover:from-brand-green-start hover:to-brand-green-end transition-all text-white"
              >
                Lanjutkan ke Form
              </Button>
            </div>
          </div>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}
