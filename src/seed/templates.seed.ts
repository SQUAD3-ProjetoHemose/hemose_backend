import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../medico/entities/template.entity';

@Injectable()
export class TemplatesSeedService {
  private readonly logger = new Logger(TemplatesSeedService.name);

  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  async seed() {
    this.logger.log('🔄 Verificando e criando templates padrão...');

    const templatesPadrao = [
      // Templates de Atestados
      {
        nome: 'Atestado de Saúde Ocupacional',
        tipo: 'atestado',
        conteudo: `ATESTADO MÉDICO

Atesto que o(a) Sr(a). {{nome}}, portador(a) do RG nº {{rg}} e CPF nº {{cpf}}, foi submetido(a) a exame clínico nesta data e encontra-se em perfeitas condições de saúde física e mental.

Não foram detectadas alterações que impeçam o exercício de suas atividades profissionais normais.

Este atestado é válido para fins ocupacionais.

{{local}}, {{dataEmissao}}

_________________________________
{{nomeMedico}}
{{especialidade}}
CRM: {{crm}}`,
        descricao: 'Template padrão para atestado de saúde ocupacional',
        padrao: true,
        ativo: true,
      },
      {
        nome: 'Atestado de Comparecimento',
        tipo: 'atestado',
        conteudo: `ATESTADO DE COMPARECIMENTO

Atesto que o(a) Sr(a). {{nome}}, portador(a) do CPF nº {{cpf}}, esteve presente neste estabelecimento de saúde no dia {{dataAtendimento}} às {{horaAtendimento}} para consulta médica.

Motivo: {{motivo}}
Tempo de permanência: {{tempoAtendimento}}

{{local}}, {{dataEmissao}}

_________________________________
{{nomeMedico}}
{{especialidade}}
CRM: {{crm}}`,
        descricao: 'Template para atestado de comparecimento médico',
        padrao: true,
        ativo: true,
      },
      {
        nome: 'Atestado de Repouso',
        tipo: 'atestado',
        conteudo: `ATESTADO MÉDICO

Atesto que o(a) paciente {{nome}}, portador(a) do CPF nº {{cpf}}, necessita de repouso médico pelo período de {{diasRepouso}} dias, a partir de {{dataInicio}}.

CID: {{cid}}
Observações: {{observacoes}}

Durante este período, o(a) paciente deverá evitar atividades que possam agravar seu quadro clínico.

{{local}}, {{dataEmissao}}

_________________________________
{{nomeMedico}}
{{especialidade}}
CRM: {{crm}}`,
        descricao: 'Template para atestado de repouso médico',
        padrao: true,
        ativo: true,
      },
      // Templates de Prescrições
      {
        nome: 'Prescrição Medicamentosa Básica',
        tipo: 'prescricao',
        conteudo: `PRESCRIÇÃO MÉDICA

Paciente: {{nome}}
CPF: {{cpf}}
Data de nascimento: {{dataNascimento}}

MEDICAMENTOS PRESCRITOS:

{{#medicamentos}}
• {{nomeMedicamento}}
  Apresentação: {{apresentacao}}
  Posologia: {{posologia}}
  Duração: {{duracao}}
  Orientações: {{orientacoes}}

{{/medicamentos}}

ORIENTAÇÕES GERAIS:
{{orientacoesGerais}}

{{local}}, {{dataEmissao}}

_________________________________
{{nomeMedico}}
{{especialidade}}
CRM: {{crm}}`,
        descricao: 'Template básico para prescrição de medicamentos',
        padrao: true,
        ativo: true,
      },
      // Templates de Laudos
      {
        nome: 'Laudo de Exame Básico',
        tipo: 'laudo',
        conteudo: `LAUDO MÉDICO

Paciente: {{nome}}
Data de nascimento: {{dataNascimento}}
CPF: {{cpf}}

EXAME REALIZADO: {{tipoExame}}
Data do exame: {{dataExame}}

RESULTADOS:
{{resultados}}

INTERPRETAÇÃO CLÍNICA:
{{interpretacao}}

CONCLUSÃO:
{{conclusao}}

RECOMENDAÇÕES:
{{recomendacoes}}

{{local}}, {{dataEmissao}}

_________________________________
{{nomeMedico}}
{{especialidade}}
CRM: {{crm}}`,
        descricao: 'Template básico para laudo de exame',
        padrao: true,
        ativo: true,
      },
      // Templates de Encaminhamentos
      {
        nome: 'Encaminhamento Especialista',
        tipo: 'encaminhamento',
        conteudo: `ENCAMINHAMENTO MÉDICO

Paciente: {{nome}}
Data de nascimento: {{dataNascimento}}
CPF: {{cpf}}

Encaminho o(a) paciente acima identificado(a) para avaliação em {{especialidade}}.

MOTIVO DO ENCAMINHAMENTO:
{{motivo}}

HISTÓRIA CLÍNICA RESUMIDA:
{{historiaClinica}}

EXAMES REALIZADOS:
{{examesRealizados}}

MEDICAMENTOS EM USO:
{{medicamentosUso}}

Solicito avaliação especializada e conduta adequada.

{{local}}, {{dataEmissao}}

_________________________________
{{nomeMedico}}
{{especialidade}}
CRM: {{crm}}`,
        descricao: 'Template para encaminhamento a especialista',
        padrao: true,
        ativo: true,
      },
    ];

    let created = 0;
    for (const templateData of templatesPadrao) {
      const exists = await this.templatesRepository.findOne({
        where: { nome: templateData.nome, padrao: true },
      });

      if (!exists) {
        const template = this.templatesRepository.create(templateData);
        await this.templatesRepository.save(template);
        created++;
      }
    }

    this.logger.log(`✅ Criados ${created} templates padrão!`);
  }
}

/*             
  __  ____ ____ _  _ 
 / _\/ ___) ___) )( \
/    \___ \___ ) \/ (
\_/\_(____(____|____/
*/
