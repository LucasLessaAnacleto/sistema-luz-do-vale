import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Selecao from "@/app/components/ui/Selecao";

export default function FichaAcolhimento() {

    return (
        <Card>

            <h2 className="mb-5 text-lg font-semibold">
                Ficha de acolhimento
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">

                <Input label="Nacionalidade" name="nacionalidade" />
                <Input label="Naturalidade" name="naturalidade" />
                <Input label="Nome do pai" name="nomePai" />
                <Input label="Nome da mãe" name="nomeMae" />
                <Input label="Escolaridade" name="escolaridade" />
                <Input label="Profissão" name="profissao" />
                <Input label="Cor" name="cor" />
                <Input label="Estado civil" name="estadoCivil" />

                <Selecao label="Possui filhos?" name="filhos" defaultValue="">
                    <option value="">Não informado</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                </Selecao>

            </div>

            <h3 className="mt-6 mb-4 text-sm font-medium">
                Dependência
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

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

            </div>

        </Card>
    );
}