import Input from "@/app/components/ui/Input";
import SecaoFormulario from "@/app/components/SecaoFormulario";

export default function DadosPaciente() {

    return (
        <SecaoFormulario titulo="Dados do acolhido">

            <div className="sm:col-span-2">
                <Input label="Nome completo" name="nome" placeholder="Nome completo" required />
            </div>

            <div className="sm:col-span-2">
                <Input label="Apelido" name="apelido" placeholder="Apelido ou nome social" />
            </div>

            <Input label="CPF" name="cpf" placeholder="000.000.000-00" required />
            <Input label="RG" name="rg" placeholder="00.000.000-0" required />

            <div className="sm:col-span-2">
                <Input label="Data de nascimento" name="dtNasc" type="date" />
            </div>

            <div className="sm:col-span-2">
                <Input label="Telefone" name="telefone" placeholder="Telefone" />
            </div>

            <div className="sm:col-span-2 pt-2">

                <h3 className="text-sm font-semibold text-primary-dark">
                    Endereço
                </h3>

            </div>

            <Input label="Rua" name="rua" placeholder="Rua" />
            <Input label="Número" name="numero" placeholder="Número" />

            <Input label="Bairro" name="bairro" placeholder="Bairro" />
            <Input label="Município" name="municipio" placeholder="Município" />

            <div className="sm:col-span-2">
                <Input label="Estado" name="estado" placeholder="Estado" />
            </div>

        </SecaoFormulario>
    );
}