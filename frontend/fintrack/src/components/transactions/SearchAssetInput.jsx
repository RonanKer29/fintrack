import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SearchAssetInput({ onSelect }) {
  const [query, setQuery] = useState("");
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setAsset(null);

    try {
      const res = await fetch(
        `http://localhost:8000/search-asset?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.error || !data.symbol) {
        setError("Aucun asset trouvé pour ce symbole.");
      } else {
        setAsset(data);
        onSelect(data); // transmet l’asset au parent
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la recherche de l’asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <Label htmlFor="asset-search" className="text-white">
          Recherche d’un asset
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="asset-search"
            type="text"
            placeholder="Ex: AAPL, BTC-USD, VTI, ETH-USD..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-[#131314] text-white"
            aria-label="Champ de recherche pour un symbole"
          />
          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="bg-[#facc15] text-black hover:bg-yellow-400 font-semibold"
            aria-label="Lancer la recherche"
          >
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {asset && (
        <div
          className="text-sm text-white bg-[#1f1f1f] p-4 rounded-md shadow-inner"
          aria-live="polite"
        >
          <p>
            <span className="font-semibold">Nom :</span> {asset.name}
          </p>
          <p>
            <span className="font-semibold">Symbole :</span> {asset.symbol}
          </p>
          <p>
            <span className="font-semibold">Devise :</span> {asset.currency}
          </p>
          <p>
            <span className="font-semibold">Type :</span> {asset.type}
          </p>
          <p>
            <span className="font-semibold">Prix actuel :</span>{" "}
            {asset.current_price
              ? `${asset.current_price} ${asset.currency}`
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
