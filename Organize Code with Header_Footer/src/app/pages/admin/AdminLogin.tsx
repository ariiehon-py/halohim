import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { PageTransition, FadeInUp } from "../../components/PageTransition";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses login
    await new Promise((r) => setTimeout(r, 800));

    // Credentials sederhana (dalam production gunakan backend yang proper)
    if (username === "admin" && password === "halohim2026") {
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Login berhasil!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Username atau password salah!");
    }

    setIsLoading(false);
  };

  return (
    <PageTransition>
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 md:px-8 py-12 bg-gradient-to-br from-brand-bg to-white">
        <FadeInUp>
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-b from-brand-blue-start to-brand-blue-end mb-4">
                <Lock className="text-white" size={28} />
              </div>
              <h1 className="font-sturoc text-brand-blue text-3xl md:text-4xl tracking-widest mb-2">
                ADMIN LOGIN
              </h1>
              <p className="font-agrandir text-brand-blue/70 text-sm">
                Dashboard Halo, Him!
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="bg-white border border-black/10 rounded-lg shadow-lg p-6 md:p-8 space-y-6 font-agrandir"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-brand-blue/20 focus:border-brand-blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-brand-blue/20 focus:border-brand-blue"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-b from-brand-blue-start to-brand-blue-end hover:from-brand-green-start hover:to-brand-green-end transition-all text-white"
              >
                {isLoading ? "Memproses..." : "Login"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-sm text-brand-blue/70 hover:text-brand-green transition-colors"
                >
                  ← Kembali ke Beranda
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-agrandir">
                <strong>Demo credentials:</strong>
                <br />
                Username: <code className="bg-blue-100 px-1 rounded">admin</code>
                <br />
                Password: <code className="bg-blue-100 px-1 rounded">halohim2026</code>
              </p>
            </div>
          </div>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}
