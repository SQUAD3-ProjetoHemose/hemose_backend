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
exports.Medico = void 0;
const typeorm_1 = require("typeorm");
const funcionario_entity_1 = require("./funcionario.entity");
const prescricao_entity_1 = require("./prescricao.entity");
let Medico = class Medico {
    id;
    nome;
    crm;
    especialidade;
    telefone;
    funcionario;
    prescricoes;
    created_at;
    updated_at;
};
exports.Medico = Medico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Medico.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Medico.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    __metadata("design:type", String)
], Medico.prototype, "crm", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Medico.prototype, "especialidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Medico.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => funcionario_entity_1.Funcionario, funcionario => funcionario.medicos),
    (0, typeorm_1.JoinColumn)({ name: 'funcionario_id' }),
    __metadata("design:type", funcionario_entity_1.Funcionario)
], Medico.prototype, "funcionario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => prescricao_entity_1.Prescricao, prescricao => prescricao.medico),
    __metadata("design:type", Array)
], Medico.prototype, "prescricoes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Medico.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Medico.prototype, "updated_at", void 0);
exports.Medico = Medico = __decorate([
    (0, typeorm_1.Entity)('medicos')
], Medico);
//# sourceMappingURL=medico.entity.js.map