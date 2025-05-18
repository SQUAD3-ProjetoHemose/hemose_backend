import { Prescricao } from './prescricao.entity';
export declare class Medicamento {
    id: number;
    nome: string;
    fabricante: string;
    lote: string;
    validade: Date;
    estoque: number;
    prescricoes: Prescricao[];
}
