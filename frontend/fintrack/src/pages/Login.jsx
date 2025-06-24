import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Échec de la connexion");

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Email ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  const handleDemoLogin = () => {
    handleLogin({ email: "demo@example.com", password: "demo123" });
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* Left Section */}
      <div className="w-1/2 hidden lg:flex flex-col justify-center items-center bg-[#1a1a1a] p-12">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold text-[#facc15]">FinTrack</h1>
          <p className="text-lg text-gray-400">
            Suivez vos investissements avec style.
          </p>
          <img
            src="/images/chart-illustration.png" // ou une image brute d'investissement
            alt="Illustration"
            className="max-w-xs mx-auto"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center w-full px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-1 text-center">
            <h2 className="text-3xl font-semibold text-[#facc15]">Connexion</h2>
            <p className="text-sm text-gray-400">
              Entrez votre email pour accéder au dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0f0f0f] border border-[#333] text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor="password">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0f0f0f] border border-[#333] text-white placeholder:text-gray-500"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#facc15] text-black hover:bg-yellow-400 transition"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <Button
            variant="ghost"
            onClick={handleDemoLogin}
            className="w-full text-[#facc15] hover:bg-[#262626] transition"
          >
            Accès Démo
          </Button>
        </div>
      </div>
    </div>
  );
}
