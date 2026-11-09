import Input from "@/app/components/ui/Input";
import Selecao from "@/app/components/ui/Selecao";
import SecaoFormulario from "@/app/components/SecaoFormulario";

export default function FichaAcolhimento() {

    return (
        <SecaoFormulario titulo="Ficha de acolhimento">

            <Input label="Nacionalidade" name="nacionalidade" placeholder="Brasileira" />
            <Input label="Naturalidade" name="naturalidade" placeholder="Cidade natal" />

            <div className="sm:col-span-2">
                <Input label="Nome do pai" name="nomePai" placeholder="Nome do pai" />
            </div>

            <div className="sm:col-span-2">
                <Input label="Nome da mãe" name="nomeMae" placeholder="Nome da mãe" />
            </div>

            <Input label="Escolaridade" name="escolaridade" placeholder="Escolaridade" />
            <Input label="Profissão" name="profissao" placeholder="Profissão" />

            <Input label="Cor" name="cor" placeholder="Cor" />
            <Input label="Estado civil" name="estadoCivil" placeholder="Estado civil" />

            <Selecao label="Possui filhos?" name="filhos" defaultValue="">

                <option value="">Não informado</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>

            </Selecao>

            <div className="sm:col-span-2 pt-2">

                <h3 className="text-sm font-semibold text-primary-dark">
                    Dependência
                </h3>

            </div>

            <div className="sm:col-span-2">

                <Input
                    label="Tipos de dependência"
                    name="tiposDependencia"
                    placeholder="Ex: Álcool, Cocaína, Tabaco"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                    Separe os tipos por vírgula.
                </p>

            </div>

            <Input label="Primeira droga lícita" name="primeiraDrogaLicita" />
            <Input label="Idade" name="idadePrimeiraDrogaLicita" type="number" min="0" />

            <Input label="Primeira droga ilícita" name="primeiraDrogaIlicita" />
            <Input label="Idade" name="idadePrimeiraDrogaIlicita" type="number" min="0" />

        </SecaoFormulario>
    );
}