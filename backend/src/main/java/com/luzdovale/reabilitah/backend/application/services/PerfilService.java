package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.perfil.PerfilRequest;
import com.luzdovale.reabilitah.backend.application.DTO.perfil.PerfilResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.PerfilNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.TipoDocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.Perfil;
import com.luzdovale.reabilitah.backend.domain.entities.PermissaoTipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumento;
import com.luzdovale.reabilitah.backend.domain.repository.PerfilRepository;
import com.luzdovale.reabilitah.backend.domain.repository.PermissaoTipoDocumentoRepository;
import com.luzdovale.reabilitah.backend.domain.repository.TipoDocumentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;
    @Autowired
    private PermissaoTipoDocumentoRepository permissaoTipoDocumentoRepository;
    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepository;

    public List<PerfilResponse> listar(){
        return perfilRepository.findAllByOrderByNomeAsc().stream()
                .map(this::mapeiaParaDTO)
                .toList();
    }

    public PerfilResponse buscar(Long id){
        return mapeiaParaDTO(buscarPorId(id));
    }

    @Transactional
    public PerfilResponse criar(PerfilRequest dto){
        return mapeiaParaDTO(salvar(new Perfil(), dto));
    }

    @Transactional
    public PerfilResponse editar(Long id, PerfilRequest dto){
        return mapeiaParaDTO(salvar(buscarPorId(id), dto));
    }

    public Perfil buscarPorId(Long id){
        return perfilRepository.findById(id)
                .orElseThrow(() -> new PerfilNaoEncontradoException(id));
    }

    public Perfil buscarOpcional(Long id){
        if(id == null || id == 0){
            return null;
        }
        return buscarPorId(id);
    }

    private Perfil salvar(Perfil perfil, PerfilRequest dados){
        if(dados.nome() == null || dados.nome().isBlank()){
            throw new IllegalArgumentException("Informe o nome do perfil.");
        }

        perfil.setNome(dados.nome().trim());
        perfil.setPermCadPaciente(dados.permCadPaciente());

        perfil = perfilRepository.save(perfil);

        if(dados.tiposDocumento() != null){
            salvarPermissoes(perfil, dados.tiposDocumento());
        }

        return perfil;
    }

    private void salvarPermissoes(Perfil perfil, List<Long> tiposDocumento){

        for(PermissaoTipoDocumento permissao : permissaoTipoDocumentoRepository.findByPerfil(perfil)){
            if(!tiposDocumento.contains(permissao.getTipoDocumento().getId())){
                permissaoTipoDocumentoRepository.delete(permissao);
            }
        }

        for(Long tipoDocumentoId : tiposDocumento){
            TipoDocumento tipoDocumento = tipoDocumentoRepository.findById(tipoDocumentoId)
                    .orElseThrow(() -> new TipoDocumentoNaoEncontradoException(tipoDocumentoId));

            if(permissaoTipoDocumentoRepository.existsByPerfilAndTipoDocumento(perfil, tipoDocumento)){
                continue;
            }

            PermissaoTipoDocumento permissao = new PermissaoTipoDocumento();

            permissao.setPerfil(perfil);
            permissao.setTipoDocumento(tipoDocumento);

            permissaoTipoDocumentoRepository.save(permissao);
        }
    }

    private PerfilResponse mapeiaParaDTO(Perfil perfil){

        List<Long> tiposDocumento = permissaoTipoDocumentoRepository.findByPerfil(perfil).stream()
                .map(permissao -> permissao.getTipoDocumento().getId())
                .toList();

        return new PerfilResponse(
            perfil.getId(),
            perfil.getNome(),
            perfil.isPermCadPaciente(),
            tiposDocumento
        );
    }
}
