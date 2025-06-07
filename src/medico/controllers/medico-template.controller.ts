import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { MedicoTemplateService } from '../services/medico-template.service';
import { CreateTemplateDto } from '../dto/create-template.dto';

@Controller('medico/templates')
@Roles(UserRole.MEDICO)
export class MedicoTemplateController {
  constructor(private readonly templateService: MedicoTemplateService) {}

  @Get(':tipo')
  async getTemplates(@Param('tipo') tipo: string, @Request() req) {
    const medicoId = req.user.id;
    return this.templateService.getTemplatesByTipo(tipo, medicoId);
  }

  @Post()
  async salvarTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
    @Request() req,
  ) {
    const medicoId = req.user.id;
    return this.templateService.criarTemplate(createTemplateDto, medicoId);
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
