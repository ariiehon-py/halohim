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

type JarasFormData = {
  pengaduanDitujukan: string;
  pengaduanLainnya?: string;
  identitasYangDiadu: string;
  jelaskanPengaduan: string;
  saranPenyelesaian: string;
  buktiPengaduan?: FileList;
};

const TARGET_OPTIONS = [
  "Ketua Himpunan",
  "Wakil Ketua Himpunan",
  "Pengurus Inti",
  "Departemen / Divisi",
  "Program Kerja",
  "Lainnya",
];

export default function JarasForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JarasFormData>();
  
  const [submitted, setSubmitted] = useState(false);
  const [identity, setIdentity] = useState({ nama: "", angkatan: "" });
  
  const ditujukan = watch("pengaduanDitujukan");

  useEffect(() => {
    const storedIdentity = sessionStorage.getItem("jaras_identity");
    if (storedIdentity) {
      setIdentity(JSON.parse(storedIdentity));
    } else {
      navigate("/jaras/identity");
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

  const onSubmit = async (data: JarasFormData) => {
    const toastId = toast.loading("Sedang mengirim pengaduan...");
    
    try {
      let publicUrl = "";

      // 1. LOGIC UPLOAD FILE KE STORAGE
      if (data.buktiPengaduan && data.buktiPengaduan.length > 0) {
        const file = data.buktiPengaduan[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `jaras/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('bukti_halohim')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('bukti_halohim')
          .getPublicUrl(filePath);
        
        publicUrl = urlData.publicUrl;
      }

      // 2. INSERT DATA KE TABEL JARAS
      const { error } = await supabase
        .from('jaras')
        .insert([
          {
            nama: identity.nama,
            angkatan: identity.angkatan,
            pengaduan_ditujukan: data.pengaduanDitujukan,
            pengaduan_lainnya: data.pengaduanLainnya || null,
            identitas_yang_diadu: data.identitasYangDiadu,
            jelaskan_pengaduan: data.jelaskanPengaduan,
            saran_penyelesaian: data.saranPenyelesaian,
            bukti_url: publicUrl || null,
          },
        ]);

      if (error) throw error;

      // 3. KIRIM NOTIFIKASI KE TELEGRAM
      const pesanTele = `
🚨 *PENGADUAN JARAS BARU!*
----------------------------
👤 *Nama Pengadu:* ${identity.nama}
🎓 *Angkatan:* ${identity.angkatan}
🎯 *Ditujukan Ke:* ${data.pengaduanDitujukan}
👤 *Pihak Teradu:* ${data.identitasYangDiadu}
📝 *Isi Pengaduan:* ${data.jelaskanPengaduan}
💡 *Saran Solusi:* ${data.saranPenyelesaian}
🖼️ *Bukti Lampiran:* ${publicUrl || 'Tidak ada bukti'}
      `;
      await sendToTelegram(pesanTele);

      toast.success("Pengaduan berhasil dikirim ke Database & Telegram!", { id: toastId });
      setSubmitted(true);
      sessionStorage.removeItem("jaras_identity");
      setTimeout(() => navigate("/"), 2000);

    } catch (error: any) {
      console.error(error);
      toast.error("Gagal mengirim pengaduan: " + error.message, { id: toastId });
    }
  };

  return (
    <PageTransition>
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <FadeInUp>
          <BackButton to="/jaras/identity" />
        </FadeInUp>

        <div className="h-6" />

        <div className="mb-8">
          <h1 className="font-sturoc text-brand-blue text-3xl md:text-5xl tracking-widest uppercase">
            Form Jaras
          </h1>
          <p className="font-agrandir text-brand-blue/70 mt-2">
            Laporkan kendala kinerja atau program kerja demi kemajuan bersama.
          </p>
          {identity.nama && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-green-start/10 to-brand-green-end/10 rounded-lg border border-brand-green/20">
              <span className="text-sm text-brand-blue/70">Pengadu:</span>
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
            <Label>Pengaduan Ditujukan Kepada</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {TARGET_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 cursor-pointer text-sm border border-black/10 rounded-md px-3 py-2 hover:border-brand-green"
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("pengaduanDitujukan", { required: true })}
                    className="accent-brand-green"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`space-y-2 transition-opacity duration-300 ${ditujukan !== "Lainnya" ? "opacity-50" : "opacity-100"}`}>
            <Label htmlFor="pengaduanLainnya">Sebutkan tujuan lainnya</Label>
            <Input
              id="pengaduanLainnya"
              disabled={ditujukan !== "Lainnya"}
              placeholder={ditujukan !== "Lainnya" ? "Pilih opsi 'Lainnya' untuk mengisi" : "Tuliskan tujuan pengaduan"}
              {...register("pengaduanLainnya")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identitasYangDiadu">Identitas yang Diadu</Label>
            <Input
              id="identitasYangDiadu"
              placeholder="Nama personil atau Nama Program Kerja"
              {...register("identitasYangDiadu", { required: true })}
            />
            {errors.identitasYangDiadu && (
              <p className="text-sm text-destructive">Wajib diisi.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jelaskanPengaduan">Jelaskan Pengaduan</Label>
            <Textarea
              id="jelaskanPengaduan"
              rows={5}
              placeholder="Ceritakan secara detail kronologi atau keluhan Anda"
              {...register("jelaskanPengaduan", { required: true })}
            />
            {errors.jelaskanPengaduan && (
              <p className="text-sm text-destructive">Wajib diisi.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="saranPenyelesaian">Saran Penyelesaian</Label>
            <Textarea
              id="saranPenyelesaian"
              rows={3}
              placeholder="Apa solusi yang Anda harapkan?"
              {...register("saranPenyelesaian", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buktiPengaduan">Bukti Pengaduan (Opsional)</Label>
            <Input
              id="buktiPengaduan"
              type="file"
              accept="image/*,application/pdf"
              {...register("buktiPengaduan")}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || submitted}
              className="bg-gradient-to-b from-brand-blue-start to-brand-blue-end hover:from-brand-green-start hover:to-brand-green-end transition-all text-white px-8"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pengaduan"}
            </Button>
          </div>
        </form>
      </section>
    </PageTransition>
  );
}