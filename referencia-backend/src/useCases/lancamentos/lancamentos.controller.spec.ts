import { Test, TestingModule } from '@nestjs/testing';
import { LancamentosController } from './lancamentos.controller';
import { LancamentosService } from './lancamentos.service';

describe('LancamentosController', () => {
  let controller: LancamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LancamentosController],
      providers: [LancamentosService],
    }).compile();

    controller = module.get<LancamentosController>(LancamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
