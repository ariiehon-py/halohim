import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { PageTransition, FadeInUp } from "../components/PageTransition";
import { BackButton } from "../components/BackButton";

// --- IMPORT SUPABASE ---
import { supabase } from "../../lib/supabase";

type KastratFormData = {
  ditujukanKepada: string;
  kategori: string;
  kategoriLainnya?: string;
  pesanAspirasi: string;
  tingkatUrgensi: string;
  kendalaPembelajaran: string;
  frekuensiKendala?: string;
  bentukKendala?: string;
  harapan: string;
  bukti?: FileList;
};

const KATEGORI_OPTIONS = [
  "Akademik",
  "Fasilitas",
  "Kemahasiswaan",
  "Dosen / Pengajaran",
  "Lainnya",
];
const URGENSI = ["Rendah", "Sedang", "Tinggi"];
const FREKUENSI = ["Jarang", "Kadang-kadang", "Sering", "Selalu"];

export default function KastratForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<KastratFormData>({
    defaultValues: { kendalaPembelajaran: "Tidak" },
  });
  const [submitted, setSubmitted] = useState(false);
  const [identity, setIdentity] = useState({ nama: "", angkatan: "" });

  const kategori = watch("kategori");
  const kendala = watch("kendalaPembelajaran");

  useEffect(() => {
    const storedIdentity = sessionStorage.getItem("kastrat_identity");
    if (storedIdentity) {
      setIdentity(JSON.parse(storedIdentity));
    } else {
      navigate("/kastrat/identity");
    }
  }, [navigate]);

  const sendToTelegram = async (message: string) => {
    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("Telegram error:", err);
    }
  };

  const onSubmit = async (data: KastratFormData) => {
    const toastId = toast.loading("Sedang mengirim aspirasi ke pusat data...");
    
    try {
      let publicUrl = "";

      // 1. LOGIC UPLOAD FILE (Storage)
      if (data.bukti && data.bukti.length > 0) {
        const file = data.bukti[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `kastrat/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('bukti_halohim')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('bukti_halohim')
          .getPublicUrl(filePath);
        
        publicUrl = urlData.publicUrl;
      }

      // 2. INSERT DATA KE SUPABASE
      const { error } = await supabase
        .from('kastrat')
        .insert([
          {
            nama: identity.nama,
            angkatan: identity.angkatan,
            ditujukan_kepada: data.ditujukanKepada,
            kategori: data.kategori,
            kategori_lainnya: data.kategoriLainnya || null,
            pesan_aspirasi: data.pesanAspirasi,
            tingkat_urgensi: data.tingkatUrgensi,
            kendala_pembelajaran: data.kendalaPembelajaran,
            frekuensi_kendala: data.frekuensiKendala || null,
            bentuk_kendala: data.bentukKendala || null,
            harapan: data.harapan,
            bukti_url: publicUrl || null,
          },
        ]);

      if (error) throw error;

      // 3. KIRIM NOTIF KE TELEGRAM
      const pesanTele = `
🚀 *ASPIRASI KASTRAT BARU!*
----------------------------
👤 *Nama:* ${identity.nama}
🎓 *Angkatan:* ${identity.angkatan}
🎯 *Ditujukan:* ${data.ditujukanKepada}
📂 *Kategori:* ${data.kategori}
📝 *Pesan:* ${data.pesanAspirasi}
⚠️ *Urgensi:* ${data.tingkatUrgensi}
🖼️ *Bukti:* ${publicUrl || 'Tidak ada'}
      `;
      await sendToTelegram(pesanTele);

      toast.success("Aspirasi berhasil dikirim ke Database & Telegram!", { id: toastId });
      setSubmitted(true);
      sessionStorage.removeItem("kastrat_identity");
      setTimeout(() => navigate("/"), 2000);

    } catch (error: any) {
      console.error(error);
      toast.error("Gagal mengirim data: " + error.message, { id: toastId });
    }
  };

  return (
    <PageTransition>
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <FadeInUp>
          <BackButton to="/kastrat/identity" />
        </FadeInUp>

        <div className="h-6" />

        <div className="mb-8">
          <h1 className="font-sturoc text-brand-blue text-3xl md:text-5xl tracking-widest">
            FORM KASTRAT
          </h1>
          <p className="font-agrandir text-brand-blue/70 mt-2">
            Sampaikan aspirasi Anda untuk lingkungan akademik yang lebih baik.
          </p>
          {identity.nama && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-green-start/10 to-brand-green-end/10 rounded-lg border border-brand-green/20">
              <span className="text-sm text-brand-blue/70">Dikirim oleh:</span>
              <span className="font-medium text-brand-blue">
                {identity.nama} {identity.angkatan !== "-" && `(${identity.angkatan})`}
              </span>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-black/10 rounded-lg shadow-sm p-6 md:p-8 space-y-6 font-agrandir"
        >
          <div className="space-y-2">
            <Label htmlFor="ditujukanKepada">Ditujukan kepada</Label>
            <Input
              id="ditujukanKepada"
              placeholder="Pihak yang dituju (Kaprodi, Dosen, dll.)"
              {...register("ditujukanKepada", { required: true })}
            />
            {errors.ditujukanKepada && (
              <p className="text-sm text-destructive">Wajib diisi.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {KATEGORI_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 cursor-pointer text-sm border border-black/10 rounded-md px-3 py-2 hover:border-brand-green"
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("kategori", { required: true })}
                    className="accent-brand-green"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.kategori && (
              <p className="text-sm text-destructive">Wajib dipilih.</p>
            )}
          </div>

          <div className={`space-y-2 transition-opacity duration-300 ${kategori !== "Lainnya" ? "opacity-50" : "opacity-100"}`}>
            <Label htmlFor="kategoriLainnya">Sebutkan kategori</Label>
            <Input 
              id="kategoriLainnya" 
              {...register("kategoriLainnya")} 
              disabled={kategori !== "Lainnya"}
              placeholder={kategori !== "Lainnya" ? "Pilih kategori 'Lainnya' untuk mengisi" : "Sebutkan kategori..."}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesanAspirasi">Pesan aspirasi</Label>
            <Textarea
              id="pesanAspirasi"
              rows={5}
              placeholder="Tuliskan aspirasi Anda"
              {...register("pesanAspirasi", { required: true })}
            />
            {errors.pesanAspirasi && (
              <p className="text-sm text-destructive">Wajib diisi.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tingkat urgensi</Label>
            <div className="flex gap-2">
              {URGENSI.map((opt) => (
                <label
                  key={opt}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-sm border border-black/10 rounded-md px-3 py-2 hover:border-brand-green"
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("tingkatUrgensi", { required: true })}
                    className="accent-brand-green"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.tingkatUrgensi && (
              <p className="text-sm text-destructive">Wajib dipilih.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Apakah mengalami kendala pembelajaran?</Label>
            <div className="flex gap-2">
              {["Ya", "Tidak"].map((opt) => (
                <label
                  key={opt}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-sm border border-black/10 rounded-md px-3 py-2 hover:border-brand-green"
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("kendalaPembelajaran", { required: true })}
                    className="accent-brand-green"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`space-y-2 transition-opacity duration-300 ${kendala !== "Ya" ? "opacity-50" : "opacity-100"}`}>
            <Label>Frekuensi kendala</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FREKUENSI.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center justify-center gap-2 cursor-pointer text-sm border border-black/10 rounded-md px-3 py-2 hover:border-brand-green ${kendala !== "Ya" ? "bg-gray-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("frekuensiKendala")}
                    disabled={kendala !== "Ya"}
                    className="accent-brand-green"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`space-y-2 transition-opacity duration-300 ${kendala !== "Ya" ? "opacity-50" : "opacity-100"}`}>
            <Label htmlFor="bentukKendala">Bentuk kendala</Label>
            <Textarea
              id="bentukKendala"
              rows={3}
              disabled={kendala !== "Ya"}
              placeholder={kendala !== "Ya" ? "Hanya diisi jika memilih 'Ya'" : "Ceritakan kendala yang dialami"}
              {...register("bentukKendala")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="harapan">Harapan ke depan</Label>
            <Textarea
              id="harapan"
              rows={3}
              placeholder="Apa harapan Anda?"
              {...register("harapan", { required: true })}
            />
            {errors.harapan && (
              <p className="text-sm text-destructive">Wajib diisi.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bukti">Bukti pendukung (opsional)</Label>
            <Input
              id="bukti"
              type="file"
              accept="image/*,application/pdf"
              {...register("bukti")}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || submitted}
              className="bg-gradient-to-b from-brand-blue-start to-brand-blue-end hover:from-brand-green-start hover:to-brand-green-end transition-all text-white"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Aspirasi"}
            </Button>
          </div>
        </form>
      </section>
    </PageTransition>
  );
}