import { Repository } from 'typeorm';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { Paciente } from '../entities/paciente.entity';
export declare class PacienteService {
    private pacienteRepository;
    constructor(pacienteRepository: Repository<Paciente>);
    create(createPacienteDto: CreatePacienteDto): Promise<Paciente>;
    findAll(): Promise<Paciente[]>;
    findById(id: number): Promise<Paciente>;
    update(id: number, updatePacienteDto: UpdatePacienteDto): Promise<Paciente>;
    remove(id: number): Promise<Paciente>;
}
