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
exports.Leito = void 0;
const typeorm_1 = require("typeorm");
const internacao_entity_1 = require("./internacao.entity");
let Leito = class Leito {
    id;
    numero;
    tipo;
    status;
    internacoes;
};
exports.Leito = Leito;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Leito.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Leito.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Leito.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Leito.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => internacao_entity_1.Internacao, internacao => internacao.leito),
    __metadata("design:type", Array)
], Leito.prototype, "internacoes", void 0);
exports.Leito = Leito = __decorate([
    (0, typeorm_1.Entity)('leitos')
], Leito);
//# sourceMappingURL=leito.entity.js.map