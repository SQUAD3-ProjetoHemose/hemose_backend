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
exports.EstoqueMedicamentos = void 0;
const typeorm_1 = require("typeorm");
const medicamento_entity_1 = require("./medicamento.entity");
let EstoqueMedicamentos = class EstoqueMedicamentos {
    id;
    medicamento;
    fornecedor;
    quantidade;
    data_recebimento;
};
exports.EstoqueMedicamentos = EstoqueMedicamentos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EstoqueMedicamentos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medicamento_entity_1.Medicamento),
    (0, typeorm_1.JoinColumn)({ name: 'medicamento_id' }),
    __metadata("design:type", medicamento_entity_1.Medicamento)
], EstoqueMedicamentos.prototype, "medicamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], EstoqueMedicamentos.prototype, "fornecedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EstoqueMedicamentos.prototype, "quantidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], EstoqueMedicamentos.prototype, "data_recebimento", void 0);
exports.EstoqueMedicamentos = EstoqueMedicamentos = __decorate([
    (0, typeorm_1.Entity)('estoque_medicamentos')
], EstoqueMedicamentos);
//# sourceMappingURL=estoque-medicamentos.entity.js.map