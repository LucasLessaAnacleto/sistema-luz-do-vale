import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LancamentosService } from './lancamentos.service';
import { CreateLancamentoDto } from './dto/create-lancamento.dto';
import { UpdateLancamentoDto } from './dto/update-lancamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserContext } from '../auth/auth-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('lancamentos')
export class LancamentosController {
  constructor(private readonly lancamentosService: LancamentosService) {}

  @Post()
  create(
    @Body() createLancamentoDto: CreateLancamentoDto,
    @UserContext() usuario: any,
  ) {
    console.log('>>>', usuario);
    return this.lancamentosService.create(createLancamentoDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.lancamentosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.lancamentosService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateLancamentoDto: UpdateLancamentoDto,
  ) {
    return this.lancamentosService.update(id, updateLancamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.lancamentosService.remove(id);
  }
}
