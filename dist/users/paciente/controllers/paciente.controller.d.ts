import { PacienteService } from '../services/paciente.service';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
export declare class PacienteController {
    private readonly pacienteService;
    constructor(pacienteService: PacienteService);
    create(createPacienteDto: CreatePacienteDto): Promise<import("../entities/paciente.entity").Paciente>;
    findAll(): Promise<import("../entities/paciente.entity").Paciente[]>;
    findOne(id: string): Promise<import("../entities/paciente.entity").Paciente>;
    update(id: string, updatePacienteDto: UpdatePacienteDto): Promise<import("../entities/paciente.entity").Paciente>;
    remove(id: string): Promise<import("../entities/paciente.entity").Paciente>;
}
