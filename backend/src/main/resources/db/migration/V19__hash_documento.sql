ALTER TABLE documento
    ADD COLUMN hash VARCHAR(64);

-- não existe mais o finalizar manual, os pendentes que não exigem assinatura ficam finalizados
UPDATE documento
SET status = 'FINALIZADO',
    dt_finalizacao = CURRENT_TIMESTAMP
WHERE status = 'PENDENTE'
  AND tipo_documento_versao_id IN (
      SELECT v.id
      FROM tipo_documento_versao v
      JOIN tipo_documento t ON t.id = v.tipo_documento_id
      WHERE t.exige_assinatura = false
  );