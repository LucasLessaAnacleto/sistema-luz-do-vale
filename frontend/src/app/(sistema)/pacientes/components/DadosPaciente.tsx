import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";

export default function DadosPaciente() {

    return (
        <Card>

            <h2 className="mb-5 text-lg font-semibold">
                Dados do paciente
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">

                <div className="sm:col-span-2">
                    <Input label="Nome completo" name="nome" required />
                </div>

                <Input label="Apelido" name="apelido" />
                <Input label="Data de nascimento" name="dtNasc" type="date" />
                <Input label="CPF" name="cpf" required />
                <Input label="RG" name="rg" required />
                <Input label="Telefone" name="telefone" />

            </div>

            <h3 className="mt-6 mb-4 text-sm font-medium">
                Endereço
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

                <Input label="Rua" name="rua" />
                <Input label="Número" name="numero" />
                <Input label="Bairro" name="bairro" />
                <Input label="Município" name="municipio" />
                <Input label="Estado" name="estado" />

            </div>

        </Card>
    );
}