import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { CreateTemplateDto } from '../dto/create-template.dto';

@Injectable()
export class MedicoTemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  // Buscar templates por tipo
  async getTemplatesByTipo(tipo: string, medicoId: number) {
    // Buscar templates globais (padrão) e do médico específico
    return await this.templateRepository.find({
      where: [
        { tipo, padrao: true, ativo: true }, // Templates padrão do sistema
        { tipo, medicoId, ativo: true }, // Templates do médico
      ],
      order: { padrao: 'DESC', nome: 'ASC' },
    });
  }

  // Criar novo template
  async criarTemplate(createTemplateDto: CreateTemplateDto, medicoId: number) {
    const template = this.templateRepository.create({
      ...createTemplateDto,
      medicoId,
      padrao: false, // Templates criados por médicos não são padrão
      ativo: true,
    });

    return await this.templateRepository.save(template);
  }

  // Atualizar template
  async atualizarTemplate(
    id: number,
    updateData: Partial<CreateTemplateDto>,
    medicoId: number,
  ) {
    const template = await this.templateRepository.findOne({
      where: { id, medicoId }, // Só pode atualizar seus próprios templates
    });

    if (!template) {
      throw new Error('Template não encontrado');
    }

    Object.assign(template, updateData);
    return await this.templateRepository.save(template);
  }

  // Deletar template
  async deletarTemplate(id: number, medicoId: number) {
    const template = await this.templateRepository.findOne({
      where: { id, medicoId },
    });

    if (!template) {
      throw new Error('Template não encontrado');
    }

    if (template.padrao) {
      throw new Error('Não é possível deletar templates padrão do sistema');
    }

    // Marcar como inativo ao invés de deletar
    template.ativo = false;
    return await this.templateRepository.save(template);
  }

  // Buscar template por ID
  async getTemplateById(id: number, medicoId?: number) {
    const whereConditions: any = { id, ativo: true };

    // Se medicoId fornecido, buscar apenas templates do médico ou padrão
    if (medicoId) {
      return await this.templateRepository.findOne({
        where: [
          { id, padrao: true, ativo: true },
          { id, medicoId, ativo: true },
        ],
      });
    }

    return await this.templateRepository.findOne({
      where: whereConditions,
    });
  }

  // Criar templates padrão do sistema
  async criarTemplatesPadrao() {
    const templatesPadrao = [
      {
        nome: 'Atestado de Saúde',
        tipo: 'atestado',
        conteudo: `Atesto que o(a) Sr(a). {{nome}}, portador(a) do CPF {{cpf}}, foi submetido(a) a exame clínico nesta data e encontra-se em boas condições de saúde.

Não foram detectadas alterações que impeçam suas atividades normais.

Local e data: {{local}}, {{dataEmissao}}`,
        descricao: 'Template padrão para atestado de saúde',
        padrao: true,
      },
      {
        nome: 'Liberação para Trabalho',
        tipo: 'atestado',
        conteudo: `Atesto que o(a) paciente {{nome}}, portador(a) do CPF {{cpf}}, encontra-se apto(a) para retornar às suas atividades laborais normais a partir de {{data}}.

Não há restrições médicas para o exercício de suas funções habituais.

Local e data: {{local}}, {{dataEmissao}}`,
        descricao: 'Template para liberação ao trabalho',
        padrao: true,
      },
      {
        nome: 'Restrição de Atividade',
        tipo: 'atestado',
        conteudo: `Atesto que o(a) paciente {{nome}}, portador(a) do CPF {{cpf}}, apresenta restrições para atividades físicas pelo período de {{dias}} dias.

Restrições: {{restricoes}}

Recomendações: {{recomendacoes}}

Local e data: {{local}}, {{dataEmissao}}`,
        descricao: 'Template para restrição de atividades',
        padrao: true,
      },
    ];

    for (const templateData of templatesPadrao) {
      const existe = await this.templateRepository.findOne({
        where: { nome: templateData.nome, padrao: true },
      });

      if (!existe) {
        const template = this.templateRepository.create(templateData);
        await this.templateRepository.save(template);
      }
    }
  }
}

/* 
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
