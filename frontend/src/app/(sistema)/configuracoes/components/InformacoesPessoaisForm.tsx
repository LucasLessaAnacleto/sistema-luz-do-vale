import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import { useAppDispatch } from "@/app/redux/hook";
import { setUsuario } from "@/app/redux/slices/authSlice";
import { alterarInformacoesPessoais } from "@/app/services/usuarioService";
import type { EditarInformacoesPessoaisRequest, Usuario } from "@/app/types/usuarios";

interface Props {
    usuario: Usuario;
}

function formatarTelefone(valor: string) {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);

    if (!digitos) {
        return "";
    }
    if (digitos.length <= 2) {
        return "(" + digitos;
    }

    const ddd = digitos.slice(0, 2);
    const numero = digitos.slice(2);

    if (numero.length === 8) {
        return `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`;
    }

    const prefixo = numero.slice(1, 5);
    const sufixo = numero.slice(5);
    return `(${ddd}) ${numero[0]}${prefixo ? " " + prefixo : ""}${sufixo ? "-" + sufixo : ""}`;
}

export default function InformacoesPessoaisForm({ usuario }: Props) {
    const dispatch = useAppDispatch();
    const modalConfirmacao = useRef<HTMLDialogElement>(null);

    const [nome, setNome] = useState(usuario.nome);
    const [email, setEmail] = useState(usuario.email);
    const [telefone, setTelefone] = useState(formatarTelefone(usuario.telefone ?? ""));
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [dadosPendentes, setDadosPendentes] = useState<EditarInformacoesPessoaisRequest | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    useEffect(() => {
        const modal = modalConfirmacao.current;
        if (!modal) {
            return;
        }

        if (dadosPendentes && !modal.open) {
            modal.showModal();
        } else if (!dadosPendentes && modal.open) {
            modal.close();
        }
    }, [dadosPendentes]);

    function confirmarAlteracoes(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (dadosPendentes || salvando) {
            return;
        }

        setErro("");
        setSucesso(false);

        const dados: EditarInformacoesPessoaisRequest = {};
        if (nome.trim() !== usuario.nome) {
            dados.nome = nome.trim();
        }
        if (email.trim() !== usuario.email) {
            dados.email = email.trim();
        }
        if (telefone !== formatarTelefone(usuario.telefone ?? "")) {
            dados.telefone = telefone;
        }

        if (senhaAtual || novaSenha || confirmarSenha) {
            if (!senhaAtual || !novaSenha) {
                setErro("Informe a senha atual e a nova senha.");
                return;
            }

            if (novaSenha !== confirmarSenha) {
                setErro("A confirmação deve ser igual à nova senha.");
                return;
            }

            dados.senhaAtual = senhaAtual;
            dados.novaSenha = novaSenha;
        }

        if (Object.keys(dados).length === 0) {
            setErro("Nenhuma alteração para salvar.");
            return;
        }

        setDadosPendentes(dados);
    }

    async function salvar(dados: EditarInformacoesPessoaisRequest) {
        try {
            setSalvando(true);
            const usuarioAtualizado = await alterarInformacoesPessoais(dados);
            dispatch(setUsuario({ usuario: usuarioAtualizado }));
            setNome(usuarioAtualizado.nome);
            setEmail(usuarioAtualizado.email);
            setTelefone(formatarTelefone(usuarioAtualizado.telefone ?? ""));
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");
            setSucesso(true);
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao salvar informações pessoais.");
        } finally {
            setDadosPendentes(null);
            setSalvando(false);
        }
    }

    return (
        <form onSubmit={confirmarAlteracoes} className="space-y-4">
            <fieldset disabled={dadosPendentes !== null} className="min-w-0 space-y-4">
                <Input label="Nome completo" autoComplete="name" maxLength={255}
                    value={nome} onChange={(evento) => setNome(evento.target.value)} />
                <Input label="E-mail" type="email" autoComplete="username" maxLength={255} required
                    value={email} onChange={(evento) => setEmail(evento.target.value)} />
                <Input label="Telefone" type="tel" autoComplete="tel-national" placeholder="(00) 0 0000-0000"
                    value={telefone} onChange={(evento) => setTelefone(formatarTelefone(evento.target.value))} />
            </fieldset>

            <fieldset disabled={dadosPendentes !== null} className="min-w-0 space-y-4 border-t border-border pt-4">
                <legend className="sr-only">Alterar senha</legend>
                <p id="requisitos-nova-senha" className="text-sm text-muted-foreground">
                    Para alterar a senha, use pelo menos 8 caracteres, com uma letra maiúscula,
                    uma letra minúscula, um número e um caractere especial.
                </p>

                <Input label="Senha atual" type="password" autoComplete="current-password"
                    value={senhaAtual} onChange={(evento) => setSenhaAtual(evento.target.value)} />
                <Input label="Nova senha" type="password" autoComplete="new-password"
                    aria-describedby="requisitos-nova-senha" value={novaSenha} onChange={(evento) => setNovaSenha(evento.target.value)} />
                <Input label="Confirmar nova senha" type="password" autoComplete="new-password"
                    value={confirmarSenha} onChange={(evento) => setConfirmarSenha(evento.target.value)} />
            </fieldset>

            {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}
            {sucesso && <p role="status" className="text-sm text-primary-dark">Informações pessoais atualizadas.</p>}

            <Button type="submit">Salvar alterações</Button>

            <dialog
                ref={modalConfirmacao}
                aria-labelledby="titulo-confirmacao-alteracoes"
                onCancel={(evento) => {
                    evento.preventDefault();
                    if (!salvando) {
                        setDadosPendentes(null);
                    }
                }}
                className="m-auto max-h-[calc(100%_-_2rem)] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-2xl bg-transparent p-0 text-foreground backdrop:bg-black/50"
            >
                {dadosPendentes && (
                    <Card>
                        <h2 id="titulo-confirmacao-alteracoes" className="text-lg font-semibold">
                            Confirmar alterações
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Deseja confirmar as alterações abaixo?
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {dadosPendentes.nome !== undefined && <li>Nome completo</li>}
                            {dadosPendentes.email !== undefined && <li>E-mail</li>}
                            {dadosPendentes.telefone !== undefined && <li>Telefone</li>}
                            {dadosPendentes.novaSenha !== undefined && <li>Senha</li>}
                        </ul>

                        <div className="mt-5 flex flex-wrap justify-end gap-2">
                            <button type="button" disabled={salvando}
                                onClick={() => setDadosPendentes(null)}
                                className="rounded-xl border border-border px-5 py-3 text-sm font-medium transition-colors enabled:cursor-pointer enabled:hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <Button loading={salvando} loadingText="Salvando..."
                                onClick={() => salvar(dadosPendentes)}
                            >
                                Confirmar
                            </Button>
                        </div>
                    </Card>
                )}
            </dialog>
        </form>
    );
}
