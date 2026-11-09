import Input from "@/app/components/ui/Input";
import SecaoFormulario from "@/app/components/SecaoFormulario";

export default function DadosResponsavel() {

    return (
        <SecaoFormulario titulo="Dados do responsável">

            <div className="sm:col-span-2">
                <Input label="Nome completo" name="responsavelNome" placeholder="Nome completo" required />
            </div>

            <Input label="Parentesco" name="responsavelParentesco" placeholder="Parentesco" />
            <Input label="Data de nascimento" name="responsavelDtNasc" type="date" />

            <Input label="CPF" name="responsavelCpf" placeholder="000.000.000-00" />
            <Input label="RG" name="responsavelRg" placeholder="00.000.000-0" />

            <div className="sm:col-span-2">
                <Input label="Telefone" name="responsavelTelefone" placeholder="Telefone" />
            </div>

            <div className="sm:col-span-2 pt-2">

                <h3 className="text-sm font-semibold text-primary-dark">
                    Endereço do responsável
                </h3>

            </div>

            <Input label="Rua" name="responsavelRua" placeholder="Rua" />
            <Input label="Número" name="responsavelNumero" placeholder="Número" />

            <Input label="Bairro" name="responsavelBairro" placeholder="Bairro" />
            <Input label="Município" name="responsavelMunicipio" placeholder="Município" />

            <div className="sm:col-span-2">
                <Input label="Estado" name="responsavelEstado" placeholder="Estado" />
            </div>

        </SecaoFormulario>
    );
}