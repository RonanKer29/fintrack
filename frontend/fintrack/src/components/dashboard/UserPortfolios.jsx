import { Badge } from "@/components/ui/badge";

export default function UserPortfolios() {
  return (
    <>
      <div className="flex justify-end gap-2 ">
        <p className="text-muted-foreground">Created on Jan 2024 • </p>
        <Badge variant="default">Private</Badge>
      </div>
    </>
  );
}
