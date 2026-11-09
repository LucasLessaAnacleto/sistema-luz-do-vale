import Input from "@/app/components/ui/Input";
import SecaoFormulario from "@/app/components/SecaoFormulario";

interface Props {
    valores?: Record<string, string>;
}

export default function DadosPaciente({ valores = {} }: Props) {

    return (
        <SecaoFormulario titulo="Dados do acolhido">

            <div className="sm:col-span-2">
                <Input label="Nome completo" name="nome" placeholder="Nome completo" defaultValue={valores.nome} required />
            </div>

            <div className="sm:col-span-2">
                <Input label="Apelido" name="apelido" placeholder="Apelido ou nome social" defaultValue={valores.apelido} />
            </div>

            <Input label="CPF" name="cpf" placeholder="000.000.000-00" defaultValue={valores.cpf} required />
            <Input label="RG" name="rg" placeholder="00.000.000-0" defaultValue={valores.rg} required />

            <div className="sm:col-span-2">
                <Input label="Data de nascimento" name="dtNasc" type="date" defaultValue={valores.dtNasc} />
            </div>

            <div className="sm:col-span-2">
                <Input label="Telefone" name="telefone" placeholder="Telefone" defaultValue={valores.telefone} />
            </div>

            <div className="sm:col-span-2 pt-2">

                <h3 className="text-sm font-semibold text-primary-dark">
                    Endereço
                </h3>

            </div>

            <Input label="Rua" name="rua" placeholder="Rua" defaultValue={valores.rua} />
            <Input label="Número" name="numero" placeholder="Número" defaultValue={valores.numero} />

            <Input label="Bairro" name="bairro" placeholder="Bairro" defaultValue={valores.bairro} />
            <Input label="Município" name="municipio" placeholder="Município" defaultValue={valores.municipio} />

            <div className="sm:col-span-2">
                <Input label="Estado" name="estado" placeholder="Estado" defaultValue={valores.estado} />
            </div>

        </SecaoFormulario>
    );
}