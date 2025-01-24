"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaBloqueio = verificaBloqueio;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function verificaBloqueio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        try {
            const usuario = yield prisma.usuario.findFirst({ where: { email } });
            if (!usuario) {
                res.status(404).json({ erro: "Usuário não encontrado" });
                return;
            }
            if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
                const tempoRestante = Math.ceil((usuario.bloqueadoAte.getTime() - new Date().getTime()) / 1000);
                res.status(403).json({
                    erro: "Usuário bloqueado. Tente novamente mais tarde.",
                    tempoRestante,
                });
                return;
            }
            return next();
        }
        catch (error) {
            console.error("Erro ao verificar bloqueio:", error);
            res.status(500).json({ erro: "Erro ao verificar bloqueio" });
            return;
        }
    });
}
