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
exports.Medicamento = void 0;
const typeorm_1 = require("typeorm");
const prescricao_entity_1 = require("./prescricao.entity");
let Medicamento = class Medicamento {
    id;
    nome;
    fabricante;
    lote;
    validade;
    estoque;
    prescricoes;
};
exports.Medicamento = Medicamento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Medicamento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Medicamento.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Medicamento.prototype, "fabricante", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Medicamento.prototype, "lote", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Medicamento.prototype, "validade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Medicamento.prototype, "estoque", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => prescricao_entity_1.Prescricao, prescricao => prescricao.medicamento),
    __metadata("design:type", Array)
], Medicamento.prototype, "prescricoes", void 0);
exports.Medicamento = Medicamento = __decorate([
    (0, typeorm_1.Entity)('medicamentos')
], Medicamento);
//# sourceMappingURL=medicamento.entity.js.map