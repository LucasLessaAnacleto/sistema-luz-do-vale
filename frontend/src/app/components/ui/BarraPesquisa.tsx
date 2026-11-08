import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BarraPesquisa({ value, onChange, placeholder = "Buscar...",}: Props) {
  return (

    <div className="relative">

      <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"/>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-secondary/50 py-3 pr-4 pl-12 text-base 
        placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      />

    </div>
  );
}