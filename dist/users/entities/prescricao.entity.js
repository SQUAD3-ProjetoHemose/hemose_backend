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
exports.Prescricao = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("../paciente/entities/paciente.entity");
const medico_entity_1 = require("./medico.entity");
const medicamento_entity_1 = require("./medicamento.entity");
let Prescricao = class Prescricao {
    id;
    paciente;
    medico;
    medicamento;
    dosagem;
    frequencia;
    data_prescricao;
};
exports.Prescricao = Prescricao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Prescricao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, paciente => paciente.prescricoes),
    (0, typeorm_1.JoinColumn)({ name: 'paciente_id' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Prescricao.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medico_entity_1.Medico, medico => medico.prescricoes),
    (0, typeorm_1.JoinColumn)({ name: 'medico_id' }),
    __metadata("design:type", medico_entity_1.Medico)
], Prescricao.prototype, "medico", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medicamento_entity_1.Medicamento),
    (0, typeorm_1.JoinColumn)({ name: 'medicamento_id' }),
    __metadata("design:type", medicamento_entity_1.Medicamento)
], Prescricao.prototype, "medicamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Prescricao.prototype, "dosagem", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Prescricao.prototype, "frequencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Prescricao.prototype, "data_prescricao", void 0);
exports.Prescricao = Prescricao = __decorate([
    (0, typeorm_1.Entity)('prescricoes')
], Prescricao);
//# sourceMappingURL=prescricao.entity.js.map