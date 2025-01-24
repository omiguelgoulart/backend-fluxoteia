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
exports.verificaCodigoRecuperacao = verificaCodigoRecuperacao;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
function verificaCodigoRecuperacao(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({ error: "Token não informado" });
            return;
        }
        const codigo = authorization.split(" ")[1];
        try {
            console.log("Recebendo email:", email);
            console.log("Recebendo código do header:", codigo);
            if (!email) {
                console.log("Email não fornecido.");
                res.status(400).json({ error: "Email é obrigatório" });
                return;
            }
            const usuario = yield prisma.usuario.findUnique({ where: { email } });
            console.log("Usuário encontrado no banco:", usuario);
            if (!usuario) {
                console.log("Usuário não encontrado.");
                res.status(404).json({ error: "Usuário não encontrado" });
                return;
            }
            if (usuario.resetToken !== codigo) {
                console.log("Código inválido para o usuário.");
                res.status(400).json({ error: "Código inválido" });
                return;
            }
            if (!usuario.resetTokenExpires || (0, date_fns_1.isBefore)(new Date(usuario.resetTokenExpires), new Date())) {
                console.log("Código expirado ou data de expiração inválida.");
                res.status(400).json({ error: "O código expirou" });
                return;
            }
            console.log("Código válido. Continuando...");
            req.body.usuario = usuario;
            next();
        }
        catch (error) {
            console.error("Erro ao verificar código de recuperação:", error);
            res.status(500).json({ error: "Erro ao verificar código de recuperação" });
        }
    });
}
