import { supabase } from "../lib/supabase";
// ... (import lainnya tetap sama)

export default function JarasForm() {
  // ... (setup react-hook-form tetap sama)

  const onSubmit = async (data: JarasFormData) => {
    try {
      toast.loading("Mengirim pengaduan...");
      let fileUrl = "";

      // 1. Upload File ke Supabase Storage (Jika Ada)
      if (data.buktiPengaduan && data.buktiPengaduan.length > 0) {
        const file = data.buktiPengaduan[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `bukti_jaras/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pengaduan_bucket') // Pastikan nama bucket ini sesuai di Supabase
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Ambil Public URL dari file yang diupload
        const { data: publicUrlData } = supabase.storage
          .from('pengaduan_bucket')
          .getPublicUrl(filePath);
        
        fileUrl = publicUrlData.publicUrl;
      }

      // 2. Simpan Data ke Supabase Database
      const { error: dbError } = await supabase
        .from('pengaduan_jaras') // Pastikan nama tabel ini sesuai di Supabase
        .insert([
          {
            ditujukan: data.pengaduanDitujukan === "Lainnya" ? data.pengaduanLainnya : data.pengaduanDitujukan,
            identitas: data.identitasYangDiadu,
            penjelasan: data.jelaskanPengaduan,
            saran: data.saranPenyelesaian,
            bukti_url: fileUrl || null
          }
        ]);

      if (dbError) throw dbError;

      // 3. Kirim Notifikasi ke Telegram
      const telegramMessage = `
🚨 *PENGADUAN JARAS BARU* 🚨

*Ditujukan Untuk:* ${data.pengaduanDitujukan === "Lainnya" ? data.pengaduanLainnya : data.pengaduanDitujukan}
*Identitas yang Diadu:* ${data.identitasYangDiadu}

*Penjelasan:*
${data.jelaskanPengaduan}

*Saran Penyelesaian:*
${data.saranPenyelesaian}

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
      toast.success("Pengaduan Anda telah berhasil dikirim!");
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.");
    }
  };

  // ... (return JSX form tetap sama)
}