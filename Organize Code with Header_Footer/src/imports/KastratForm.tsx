import { supabase } from "../lib/supabase";
// ... (import lainnya tetap sama)

export default function KastratForm() {
  // ... (setup react-hook-form tetap sama)

  const onSubmit = async (data: KastratFormData) => {
    try {
      toast.loading("Mengirim aspirasi...");
      let fileUrl = "";

      // 1. Upload File ke Supabase Storage (Jika Ada)
      if (data.bukti && data.bukti.length > 0) {
        const file = data.bukti[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `bukti_kastrat/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pengaduan_bucket')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('pengaduan_bucket')
          .getPublicUrl(filePath);
        
        fileUrl = publicUrlData.publicUrl;
      }

      // 2. Simpan Data ke Supabase Database
      const { error: dbError } = await supabase
        .from('aspirasi_kastrat') // Pastikan kamu membuat tabel ini di Supabase
        .insert([
          {
            ditujukan: data.ditujukanKepada,
            kategori: data.kategori === "Lainnya" ? data.kategoriLainnya : data.kategori,
            pesan: data.pesanAspirasi,
            urgensi: data.tingkatUrgensi,
            mengalami_kendala: data.kendalaPembelajaran,
            frekuensi_kendala: data.frekuensiKendala,
            bentuk_kendala: data.bentukKendala,
            harapan: data.harapan,
            bukti_url: fileUrl || null
          }
        ]);

      if (dbError) throw dbError;

      // 3. Kirim Notifikasi ke Telegram
      const telegramMessage = `
📢 *ASPIRASI KASTRAT BARU* 📢

*Ditujukan Kepada:* ${data.ditujukanKepada}
*Kategori:* ${data.kategori === "Lainnya" ? data.kategoriLainnya : data.kategori}
*Tingkat Urgensi:* ${data.tingkatUrgensi}

*Pesan Aspirasi:*
${data.pesanAspirasi}

*Kendala Pembelajaran:* ${data.kendalaPembelajaran}
*Frekuensi:* ${data.frekuensiKendala}
*Bentuk Kendala:*
${data.bentukKendala}

*Harapan ke Depan:*
${data.harapan}

*Bukti Lampiran:* ${fileUrl ? fileUrl : "Tidak ada lampiran"}
      `;

      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      });

      toast.dismiss();
      toast.success("Aspirasi Anda telah berhasil dikirim!");
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Terjadi kesalahan saat mengirim aspirasi. Silakan coba lagi.");
    }
  };

  // ... (return JSX form tetap sama)
}