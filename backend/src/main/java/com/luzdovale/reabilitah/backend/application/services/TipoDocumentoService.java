package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.documento.FormularioDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.tipoDocumento.TipoDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.PacienteNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.TipoDocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.TipoDocumentoVersaoNaoEncontradoExeption;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.PermissaoTipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.PacienteRepository;
import com.luzdovale.reabilitah.backend.domain.repository.PermissaoTipoDocumentoRepository;
import com.luzdovale.reabilitah.backend.domain.repository.TipoDocumentoRepository;
import com.luzdovale.reabilitah.backend.domain.repository.TipoDocumentoVersaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class TipoDocumentoService {
    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepository;
    @Autowired
    private TipoDocumentoVersaoRepository versaoRepository;
    @Autowired
    private DocumentoCamposService documentoCamposService;
    @Autowired
    private PermissaoTipoDocumentoRepository permissaoTipoDocumentoRepository;
    @Autowired
    private PerfilService perfilService;
    @Autowired
    private ResponsavelService responsavelService;
    @Autowired
    private PacienteRepository pacienteRepository;

    public FormularioDocumentoResponse buscarFormulario(Long tipoDocumentoId, Long pacienteId, Usuario usuarioLogado) {

        TipoDocumentoVersao versao = ultimaVersaoDocumento(tipoDocumentoId);
        TipoDocumento tipoDocumento = versao.getTipoDocumento();

        validarPermissao(tipoDocumento, usuarioLogado);

        var paciente = pacienteRepository.findById(pacienteId).orElseThrow(() -> new PacienteNaoEncontradoException(pacienteId));
        var responsavel = responsavelService.buscarPorPaciente(paciente);
        var campos = documentoCamposService.lerCampos(versao);
        var listas = documentoCamposService.resolverListas(campos);
        var dadosPadrao = documentoCamposService.resolverDadosPadrao(campos, paciente, responsavel);

        return new FormularioDocumentoResponse(
            tipoDocumento.getId(),
            tipoDocumento.getNome(),
            tipoDocumento.getDescricao(),
            tipoDocumento.isExigeAssinatura(),
            versao.getId(),
            versao.getVersao(),
            campos,
            listas,
            dadosPadrao
        );
    }

    public TipoDocumentoVersao ultimaVersaoDocumento(Long tipoDocumentoId){
        TipoDocumento tipoDocumento = tipoDocumentoRepository
                .findById(tipoDocumentoId)
                .orElseThrow(() -> new TipoDocumentoNaoEncontradoException(tipoDocumentoId));

        return versaoRepository
                .findFirstByTipoDocumentoOrderByVersaoDesc(tipoDocumento)
                .orElseThrow(() -> new TipoDocumentoVersaoNaoEncontradoExeption());
    }

    public TipoDocumentoVersao ultimaVersaoFichaAcolhimento() {

        return versaoRepository.findFirstByTemplateOrderByVersaoDesc("ficha-acolhimento")
                .orElseThrow(TipoDocumentoVersaoNaoEncontradoExeption::new);
    }

    public TipoDocumentoVersao buscarVersaoId(Long versaoId){
        return versaoRepository.findById(versaoId).orElseThrow(() -> new TipoDocumentoVersaoNaoEncontradoExeption());
    }

    public List<TipoDocumentoResponse> listar(Usuario usuarioLogado) {

        List<TipoDocumento> tipos;

        if (usuarioLogado.isAdmin()) {
            tipos = tipoDocumentoRepository
                    .findByAtivoTrueOrderByNomeAsc();
        } else {

            if (usuarioLogado.getPerfil() == null) {
                return List.of();
            }

            tipos = permissaoTipoDocumentoRepository
                    .findByPerfil(usuarioLogado.getPerfil())
                    .stream()
                    .map(perm -> perm.getTipoDocumento())
                    .filter(tipoDocumento -> tipoDocumento.isAtivo())
                    .toList();
        }

        return tipos.stream().map(this::mapeiaParaDTO).toList();
    }

    public void adicionarPermissao(Long tipoDocumentoId, Long perfilId) {

        TipoDocumento tipoDocumento = tipoDocumentoRepository.findById(tipoDocumentoId)
                .orElseThrow(() -> new TipoDocumentoNaoEncontradoException(tipoDocumentoId));

        var perfil = perfilService.buscarPorId(perfilId);

        if (permissaoTipoDocumentoRepository.existsByPerfilAndTipoDocumento(perfil,tipoDocumento)) {
            return;
        }

        PermissaoTipoDocumento permissao = new PermissaoTipoDocumento();

        permissao.setPerfil(perfil);
        permissao.setTipoDocumento(tipoDocumento);

        permissaoTipoDocumentoRepository.save(permissao);
    }

    public void removerPermissao(Long tipoDocumentoId, Long perfilId) {

        TipoDocumento tipoDocumento = tipoDocumentoRepository.findById(tipoDocumentoId)
                .orElseThrow(() -> new TipoDocumentoNaoEncontradoException(tipoDocumentoId));

        var perfil = perfilService.buscarPorId(perfilId);

        permissaoTipoDocumentoRepository.deleteByPerfilAndTipoDocumento(perfil,tipoDocumento);
    }

    public void validarPermissao(TipoDocumento tipoDocumento, Usuario usuario) {

        if (usuario.isAdmin()) {
            return;
        }

        if (usuario.getPerfil() == null ||
            !permissaoTipoDocumentoRepository.existsByPerfilAndTipoDocumento(usuario.getPerfil(),tipoDocumento)
        ) {
            throw new UsuarioSemAutorizacao();
        }
    }

    private TipoDocumentoResponse mapeiaParaDTO(TipoDocumento tipoDocumento) {

        return new TipoDocumentoResponse(
            tipoDocumento.getId(),
            tipoDocumento.getNome(),
            tipoDocumento.getDescricao(),
            tipoDocumento.isExigeAssinatura()
        );
    }

}
