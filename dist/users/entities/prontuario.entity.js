"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prontuario = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("../paciente/entities/paciente.entity");
const medico_entity_1 = require("./medico.entity");
const historico_paciente_entity_1 = require("./historico-paciente.entity");
let Prontuario = class Prontuario {
    id;
    paciente;
    medico;
    data_atendimento;
    descricao;
    historicos;
    created_at;
};
exports.Prontuario = Prontuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Prontuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente),
    (0, typeorm_1.JoinColumn)({ name: 'paciente_id' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Prontuario.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medico_entity_1.Medico),
    (0, typeorm_1.JoinColumn)({ name: 'medico_id' }),
    __metadata("design:type", medico_entity_1.Medico)
], Prontuario.prototype, "medico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Prontuario.prototype, "data_atendimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Prontuario.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => historico_paciente_entity_1.HistoricoPaciente, historico => historico.prontuario),
    __metadata("design:type", Array)
], Prontuario.prototype, "historicos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Prontuario.prototype, "created_at", void 0);
exports.Prontuario = Prontuario = __decorate([
    (0, typeorm_1.Entity)('prontuarios')
], Prontuario);
//# sourceMappingURL=prontuario.entity.js.map