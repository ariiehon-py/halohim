import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageTransition, FadeInUp } from "../../components/PageTransition";
import { BackButton } from "../../components/BackButton";
import { Calendar, User, FileText, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// --- IMPORT SUPABASE ---
import { supabase } from "../../../lib/supabase";

export default function SubmissionDetail() {
  const navigate = useNavigate();
  const { type, id } = useParams(); // Ambil tipe (kastrat/jaras) dan id dari URL
  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_auth");
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    fetchDetail();
  }, [id, type, navigate]);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      if (!type || !id) return;

      const { data, error } = await supabase
        .from(type) // Akan otomatis mencari ke tabel 'kastrat' atau 'jaras'
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setSubmission(data);
    } catch (error: any) {
      toast.error("Gagal memuat detail: " + error.message);
      navigate("/admin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="font-agrandir text-brand-blue/70 animate-pulse">Memuat data dari database...</p>
      </div>
    );
  }

  if (!submission) return null;

  return (
    <PageTransition>
      <section className="min-h-[calc(100vh-4rem)] px-4 md:px-8 py-12 bg-gradient-to-br from-brand-bg to-white">
        <div className="max-w-4xl mx-auto">
          <FadeInUp>
            <BackButton to="/admin/dashboard" />
          </FadeInUp>

          <div className="h-6" />

          <FadeInUp delay={0.1}>
            <div className="bg-white border border-black/10 rounded-xl shadow-md overflow-hidden font-agrandir">
              {/* Header Detail */}
              <div className={`p-6 text-white ${type === "kastrat" ? "bg-gradient-to-r from-brand-green-start to-brand-green-end" : "bg-gradient-to-r from-brand-blue-start to-brand-blue-end"}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-sturoc text-2xl md:text-3xl tracking-widest mb-1">
                      DETAIL {type?.toUpperCase()}
                    </h1>
                    <p className="opacity-90 text-sm">ID: {submission.id}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30 text-sm">
                    {new Date(submission.created_at).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              {/* Konten Utama */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Info Pengirim */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-black/5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-brand-bg rounded-lg text-brand-blue"><User size={20} /></div>
                    <div>
                      <p className="text-xs text-brand-blue/60 uppercase font-bold tracking-tighter">Nama Pengirim</p>
                      <p className="text-brand-blue font-medium">{submission.nama || "Anonim"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-brand-bg rounded-lg text-brand-blue"><Calendar size={20} /></div>
                    <div>
                      <p className="text-xs text-brand-blue/60 uppercase font-bold tracking-tighter">Angkatan</p>
                      <p className="text-brand-blue font-medium">{submission.angkatan || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Data Form Dinamis */}
                <div className="space-y-6">
                  {type === "kastrat" ? (
                    <>
                      <DetailField label="Ditujukan Kepada" value={submission.ditujukan_kepada} />
                      <DetailField label="Kategori" value={submission.kategori} />
                      {submission.kategori_lainnya && <DetailField label="Kategori Lainnya" value={submission.kategori_lainnya} />}
                      <DetailField label="Pesan Aspirasi" value={submission.pesan_aspirasi} multiline />
                      <DetailField label="Tingkat Urgensi" value={submission.tingkat_urgensi} />
                      <DetailField label="Kendala Pembelajaran" value={submission.kendala_pembelajaran} />
                      {submission.kendala_pembelajaran === "Ya" && (
                        <>
                          <DetailField label="Frekuensi Kendala" value={submission.frekuensi_kendala} />
                          <DetailField label="Bentuk Kendala" value={submission.bentuk_kendala} multiline />
                        </>
                      )}
                      <DetailField label="Harapan" value={submission.harapan} multiline />
                    </>
                  ) : (
                    <>
                      <DetailField label="Pengaduan Ditujukan" value={submission.pengaduan_ditujukan} />
                      {submission.pengaduan_lainnya && <DetailField label="Tujuan Lainnya" value={submission.pengaduan_lainnya} />}
                      <DetailField label="Identitas yang Diadu" value={submission.identitas_yang_diadu} />
                      <DetailField label="Penjelasan Pengaduan" value={submission.jelaskan_pengaduan} multiline />
                      <DetailField label="Saran Penyelesaian" value={submission.saran_penyelesaian} multiline />
                    </>
                  )}

                  {/* Bukti File */}
                  <div className="pt-4">
                    <p className="text-xs text-brand-blue/60 uppercase font-bold mb-3 tracking-tighter">Bukti Pendukung</p>
                    {submission.bukti_url ? (
                      <a 
                        href={submission.bukti_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-bg border border-brand-blue/20 rounded-lg text-brand-blue hover:bg-brand-blue hover:text-white transition-all group"
                      >
                        <ExternalLink size={18} />
                        <span>Lihat Bukti Lampiran</span>
                      </a>
                    ) : (
                      <p className="text-brand-blue/40 italic text-sm">Tidak ada lampiran bukti.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </PageTransition>
  );
}

function DetailField({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-brand-blue/60 uppercase font-bold tracking-tighter">{label}</p>
      <div className={`p-3 bg-gray-50 rounded-lg border border-black/5 text-brand-blue ${multiline ? "whitespace-pre-wrap leading-relaxed" : ""}`}>
        {value || "-"}
      </div>
    </div>
  );
}