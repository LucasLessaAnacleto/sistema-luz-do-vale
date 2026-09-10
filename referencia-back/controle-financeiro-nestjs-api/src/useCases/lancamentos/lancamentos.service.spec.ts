import { Test, TestingModule } from '@nestjs/testing';
import { LancamentosService } from './lancamentos.service';

describe('LancamentosService', () => {
  let service: LancamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LancamentosService],
    }).compile();

    service = module.get<LancamentosService>(LancamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
