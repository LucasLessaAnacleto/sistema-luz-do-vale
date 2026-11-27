interface Props {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    sugestoes: string[];
    placeholder?: string;
}

export default function InputSugestoes({ label, name, value, onChange, sugestoes, placeholder = "" }: Props) {
    return (
        <div>

            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {label}
            </label>

            <input
                type="search"
                name={name}
                list={`${name}-sugestoes`}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-9 w-full rounded-lg border border-border bg-input-background px-2.5 text-sm
                placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />

            <datalist id={`${name}-sugestoes`}>
                {sugestoes.map((sugestao) => (
                    <option key={sugestao} value={sugestao} />
                ))}
            </datalist>

        </div>
    );
}