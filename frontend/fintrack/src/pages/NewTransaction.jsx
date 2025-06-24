import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchAssetInput from "@/components/transactions/SearchAssetInput";

export default function NewTransaction() {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [formData, setFormData] = useState({
    asset_id: "",
    portfolio_id: 1,
    type: "buy",
    quantity: "",
    price: "",
    currency: "CHF",
    date: new Date().toISOString().split("T")[0],
  });

  // Pré-remplit le prix unitaire dès qu'un asset est sélectionné
  useEffect(() => {
    if (selectedAsset?.current_price) {
      setFormData((prev) => ({
        ...prev,
        price: selectedAsset.current_price,
      }));
    }
  }, [selectedAsset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset) {
      toast.error("Sélectionne un asset avant de continuer.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // 1. Vérifie ou crée l'asset
      const checkRes = await fetch(
        `http://localhost:8000/assets/check-or-create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedAsset),
        }
      );
      if (!checkRes.ok) throw new Error("Erreur lors de l’ajout de l’asset");
      const asset = await checkRes.json();

      // 2. Ajoute la transaction
      const res = await fetch("http://localhost:8000/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          asset_id: asset.id,
          currency: selectedAsset.currency || "CHF",
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l’ajout");

      toast.success("Transaction ajoutée avec succès !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur transaction :", error);
      toast.error("Échec de l’ajout. Vérifie les données.");
    }
  };

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto">
      <Card className="p-6 bg-[#212121] text-white space-y-6">
        <h1 className="text-2xl font-bold text-[#facc15]">
          Ajouter une transaction
        </h1>

        {/* Recherche d’asset */}
        <div>
          <SearchAssetInput onSelect={setSelectedAsset} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quantité */}
          <div>
            <Label className="mb-2" htmlFor="quantity">
              Quantité
            </Label>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Ex: 10"
              className="bg-[#131314] text-white mb-2"
              required
            />
          </div>

          {/* Prix unitaire */}
          <div>
            <Label className="mb-2" htmlFor="price">
              Prix unitaire
            </Label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ex: 95.45"
              className="bg-[#131314] text-white"
              required
            />
          </div>

          {/* Type de transaction */}
          <div>
            <Label className="mb-2">Type de transaction</Label>
            <Select
              value={formData.type}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, type: val }))
              }
            >
              <SelectTrigger className="bg-[#131314] text-white">
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent className="bg-[#212121] text-white">
                <SelectItem value="buy">Achat</SelectItem>
                <SelectItem value="sell">Vente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label className="mb-2" htmlFor="date">
              Date
            </Label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="bg-[#131314] text-white"
              required
            />
          </div>

          <Button
            type="submit"
            className="bg-[#facc15] text-black hover:bg-yellow-400 font-semibold"
          >
            Ajouter la transaction
          </Button>
        </form>
      </Card>
    </div>
  );
}
