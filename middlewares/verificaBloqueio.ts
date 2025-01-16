import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export async function verificaBloqueio(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email } = req.body;

  try {
    const usuario = await prisma.usuario.findFirst({ where: { email } });

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
  } catch (error) {
    console.error("Erro ao verificar bloqueio:", error);
    res.status(500).json({ erro: "Erro ao verificar bloqueio" });
    return;
  }
}
