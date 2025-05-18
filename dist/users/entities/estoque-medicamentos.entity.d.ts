import { Medicamento } from './medicamento.entity';
export declare class EstoqueMedicamentos {
    id: number;
    medicamento: Medicamento;
    fornecedor: string;
    quantidade: number;
    data_recebimento: Date;
}
