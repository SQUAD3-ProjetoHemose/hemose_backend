import { Funcionario } from './funcionario.entity';
import { Internacao } from './internacao.entity';
export declare class FuncionarioInternacao {
    id: number;
    funcionario: Funcionario;
    internacao: Internacao;
    funcao: string;
}
