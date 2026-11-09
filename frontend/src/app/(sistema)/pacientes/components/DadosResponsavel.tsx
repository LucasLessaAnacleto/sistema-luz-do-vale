import Input from "@/app/components/ui/Input";
import SecaoFormulario from "@/app/components/SecaoFormulario";

interface Props {
    valores?: Record<string, string>;
}

export default function DadosResponsavel({ valores = {} }: Props) {

    return (
        <SecaoFormulario titulo="Dados do responsável">

            <div className="sm:col-span-2">
                <Input label="Nome completo" name="responsavelNome" placeholder="Nome completo" defaultValue={valores.responsavelNome} required />
            </div>

            <Input label="Parentesco" name="responsavelParentesco" placeholder="Parentesco" defaultValue={valores.responsavelParentesco} />
            <Input label="Data de nascimento" name="responsavelDtNasc" type="date" defaultValue={valores.responsavelDtNasc} />

            <Input label="CPF" name="responsavelCpf" placeholder="000.000.000-00" defaultValue={valores.responsavelCpf} />
            <Input label="RG" name="responsavelRg" placeholder="00.000.000-0" defaultValue={valores.responsavelRg} />

            <div className="sm:col-span-2">
                <Input label="Telefone" name="responsavelTelefone" placeholder="Telefone" defaultValue={valores.responsavelTelefone} />
            </div>

            <div className="sm:col-span-2 pt-2">

                <h3 className="text-sm font-semibold text-primary-dark">
                    Endereço do responsável
                </h3>

            </div>

            <Input label="Rua" name="responsavelRua" placeholder="Rua" defaultValue={valores.responsavelRua} />
            <Input label="Número" name="responsavelNumero" placeholder="Número" defaultValue={valores.responsavelNumero} />

            <Input label="Bairro" name="responsavelBairro" placeholder="Bairro" defaultValue={valores.responsavelBairro} />
            <Input label="Município" name="responsavelMunicipio" placeholder="Município" defaultValue={valores.responsavelMunicipio} />

            <div className="sm:col-span-2">
                <Input label="Estado" name="responsavelEstado" placeholder="Estado" defaultValue={valores.responsavelEstado} />
            </div>

        </SecaoFormulario>
    );
}