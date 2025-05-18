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
exports.FuncionarioInternacao = void 0;
const typeorm_1 = require("typeorm");
const funcionario_entity_1 = require("./funcionario.entity");
const internacao_entity_1 = require("./internacao.entity");
let FuncionarioInternacao = class FuncionarioInternacao {
    id;
    funcionario;
    internacao;
    funcao;
};
exports.FuncionarioInternacao = FuncionarioInternacao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FuncionarioInternacao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => funcionario_entity_1.Funcionario),
    (0, typeorm_1.JoinColumn)({ name: 'funcionario_id' }),
    __metadata("design:type", funcionario_entity_1.Funcionario)
], FuncionarioInternacao.prototype, "funcionario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => internacao_entity_1.Internacao),
    (0, typeorm_1.JoinColumn)({ name: 'internacao_id' }),
    __metadata("design:type", internacao_entity_1.Internacao)
], FuncionarioInternacao.prototype, "internacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], FuncionarioInternacao.prototype, "funcao", void 0);
exports.FuncionarioInternacao = FuncionarioInternacao = __decorate([
    (0, typeorm_1.Entity)('funcionarios_internacoes')
], FuncionarioInternacao);
//# sourceMappingURL=funcionario-internacao.entity.js.map