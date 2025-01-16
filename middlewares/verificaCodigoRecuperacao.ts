import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { isBefore } from "date-fns";

const prisma = new PrismaClient();

export async function verificaCodigoRecuperacao(req: Request, res: Response, next: NextFunction) {
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


    const usuario = await prisma.usuario.findUnique({ where: { email } });
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

    if (!usuario.resetTokenExpires || isBefore(new Date(usuario.resetTokenExpires), new Date())) {
      console.log("Código expirado ou data de expiração inválida.");
      res.status(400).json({ error: "O código expirou" });
      return;
    }

    console.log("Código válido. Continuando...");
    req.body.usuario = usuario;

    next();
  } catch (error) {
    console.error("Erro ao verificar código de recuperação:", error);
    res.status(500).json({ error: "Erro ao verificar código de recuperação" });
  }
}
