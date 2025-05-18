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
exports.Internacao = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("../paciente/entities/paciente.entity");
const leito_entity_1 = require("./leito.entity");
const medico_entity_1 = require("./medico.entity");
let Internacao = class Internacao {
    id;
    paciente;
    leito;
    medico_responsavel;
    data_entrada;
    data_saida;
    diagnostico;
};
exports.Internacao = Internacao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Internacao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, paciente => paciente.internacoes),
    (0, typeorm_1.JoinColumn)({ name: 'paciente_id' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Internacao.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leito_entity_1.Leito),
    (0, typeorm_1.JoinColumn)({ name: 'leito_id' }),
    __metadata("design:type", leito_entity_1.Leito)
], Internacao.prototype, "leito", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medico_entity_1.Medico),
    (0, typeorm_1.JoinColumn)({ name: 'medico_responsavel' }),
    __metadata("design:type", medico_entity_1.Medico)
], Internacao.prototype, "medico_responsavel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Internacao.prototype, "data_entrada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Internacao.prototype, "data_saida", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Internacao.prototype, "diagnostico", void 0);
exports.Internacao = Internacao = __decorate([
    (0, typeorm_1.Entity)('internacoes')
], Internacao);
//# sourceMappingURL=internacao.entity.js.map