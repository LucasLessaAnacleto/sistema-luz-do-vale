import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";

export default function DadosResponsavel() {

    return (
        <Card>

            <h2 className="mb-5 text-lg font-semibold">
                Responsável
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">

                <div className="sm:col-span-2">
                    <Input label="Nome completo" name="responsavelNome" required />
                </div>

                <Input label="Parentesco" name="responsavelParentesco" />
                <Input label="Data de nascimento" name="responsavelDtNasc" type="date" />
                <Input label="CPF" name="responsavelCpf" />
                <Input label="RG" name="responsavelRg" />
                <Input label="Telefone" name="responsavelTelefone" />

            </div>

            <h3 className="mt-6 mb-4 text-sm font-medium">
                Endereço do responsável
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

                <Input label="Rua" name="responsavelRua" />
                <Input label="Número" name="responsavelNumero" />
                <Input label="Bairro" name="responsavelBairro" />
                <Input label="Município" name="responsavelMunicipio" />
                <Input label="Estado" name="responsavelEstado" />

            </div>

        </Card>
    );
}