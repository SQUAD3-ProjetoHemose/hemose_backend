import { Internacao } from './internacao.entity';
export declare class Leito {
    id: number;
    numero: number;
    tipo: string;
    status: string;
    internacoes: Internacao[];
}
