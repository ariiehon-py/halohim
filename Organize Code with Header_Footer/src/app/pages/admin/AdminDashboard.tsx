import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageTransition, FadeInUp } from "../../components/PageTransition";
import { Button } from "../../components/ui/button";
import { LogOut, FileText, MessageSquare, Calendar, User, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// --- IMPORT SUPABASE ---
import { supabase } from "../../../lib/supabase";

interface Submission {
  id: string;
  type: "kastrat" | "jaras";
  created_at: string; // Menggunakan kolom dari Supabase
  nama: string;
  angkatan: string;
  // Kita tampung semua data tambahan di sini
  [key: string]: any; 
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | "kastrat" | "jaras">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_auth");
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    loadAllSubmissions();
  }, [navigate]);

  // --- FUNGSI AMBIL DATA DARI SUPABASE ---
  const loadAllSubmissions = async () => {
    setIsLoading(true);
    try {
      // Ambil data dari tabel kastrat
      const { data: kastratData, error: kError } = await supabase
        .from('kastrat')
        .select('*')
        .order('created_at', { ascending: false });

      // Ambil data dari tabel jaras
      const { data: jarasData, error: jError } = await supabase
        .from('jaras')
        .select('*')
        .order('created_at', { ascending: false });

      if (kError || jError) throw (kError || jError);

      // Gabungkan data dan beri tanda tipe
      // Gabungkan data dan beri tanda tipe secara eksplisit
      const combined: Submission[] = [
        ...(kastratData?.map((d: any) => ({ ...d, type: 'kastrat' as const })) || []),
        ...(jarasData?.map((d: any) => ({ ...d, type: 'jaras' as const })) || [])
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSubmissions(combined);
    } catch (error: any) {
      toast.error("Gagal memuat data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    toast.success("Logout berhasil");
    navigate("/admin/login");
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    return sub.type === filter;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const kastratCount = submissions.filter((s) => s.type === "kastrat").length;
  const jarasCount = submissions.filter((s) => s.type === "jaras").length;

  return (
    <PageTransition>
      <section className="min-h-[calc(100vh-4rem)] px-4 md:px-8 py-8 bg-gradient-to-br from-brand-bg to-white">
        <div className="max-w-6xl mx-auto">
          <FadeInUp>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="font-sturoc text-brand-blue text-3xl md:text-4xl tracking-widest mb-2">
                  ADMIN DASHBOARD
                </h1>
                <p className="font-agrandir text-brand-blue/70">
                  Kelola dan lihat semua submission dari Database Supabase
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button
                  onClick={loadAllSubmissions}
                  variant="outline"
                  disabled={isLoading}
                  className="border-brand-blue text-brand-blue"
                >
                  <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </FadeInUp>

          {/* Stats & Filter (Sama Seperti Kode Kamu Sebelumnya) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <FadeInUp delay={0.1}>
              <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-agrandir text-sm text-brand-blue/70 mb-1">Total Submission</p>
                    <p className="font-sturoc text-3xl text-brand-blue">{submissions.length}</p>
                  </div>
                  <FileText className="text-brand-blue/30" size={40} />
                </div>
              </div>
            </FadeInUp>
            {/* ... kastratCount & jarasCount stats ... */}
          </div>

          <FadeInUp delay={0.4}>
            <div className="bg-white border border-black/10 rounded-lg p-4 mb-6 shadow-sm flex gap-2 font-agrandir">
                <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-md transition-colors ${filter === "all" ? "bg-brand-blue text-white" : "bg-gray-100 text-brand-blue hover:bg-gray-200"}`}>
                  Semua ({submissions.length})
                </button>
                <button onClick={() => setFilter("kastrat")} className={`px-4 py-2 rounded-md transition-colors ${filter === "kastrat" ? "bg-gradient-to-b from-brand-green-start to-brand-green-end text-white" : "bg-gray-100 text-brand-blue hover:bg-gray-200"}`}>
                  Kastrat ({kastratCount})
                </button>
                <button onClick={() => setFilter("jaras")} className={`px-4 py-2 rounded-md transition-colors ${filter === "jaras" ? "bg-gradient-to-b from-brand-blue-start to-brand-blue-end text-white" : "bg-gray-100 text-brand-blue hover:bg-gray-200"}`}>
                  Jaras ({jarasCount})
                </button>
            </div>
          </FadeInUp>

          {/* Submissions List */}
          <FadeInUp delay={0.5}>
            <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center animate-pulse">
                   <p className="font-agrandir text-brand-blue/70">Menghubungkan ke database...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="mx-auto text-brand-blue/30 mb-4" size={64} />
                  <p className="font-agrandir text-brand-blue/70">Belum ada submission di database</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full font-agrandir">
                    <thead className="bg-gradient-to-r from-brand-blue-start to-brand-blue-end text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Tipe</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Pengirim</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Angkatan</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Tanggal</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-brand-bg/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${submission.type === "kastrat" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                              {submission.type === "kastrat" ? "Kastrat" : "Jaras"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {submission.nama}
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-blue/70">
                            {submission.angkatan}
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-blue/70">
                            {formatDate(submission.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              onClick={() => navigate(`/admin/submission/${submission.type}/${submission.id}`)}
                              className="bg-gradient-to-b from-brand-blue-start to-brand-blue-end text-white text-sm"
                            >
                              Lihat Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeInUp>
        </div>
      </section>
    </PageTransition>
  );
}