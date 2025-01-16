import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function bloqueiaSenha(usuario: any): Promise<{ tempoRestante: number | null }> {
  const tentativas = (usuario.tentativasLogin ?? 0) + 1;
  let bloqueadoAte: Date | null = null;

  if (tentativas >= 3) {
    bloqueadoAte = new Date();
    bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + 60);
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
        tentativasLogin: tentativas,
        bloqueadoAte,
        bloqueado: bloqueadoAte ? true : false,
    },
  });

  let tempoRestante: number | null = null;
  if (bloqueadoAte) {
    tempoRestante = Math.ceil((bloqueadoAte.getTime() - new Date().getTime()) / 60);
  }

  await prisma.log.create({
    data: {
      descricao: "Tentativa de Acesso Inválida",
      complemento: `Email: ${usuario.email}`,
      usuarioId: usuario.id,
    },
  });

  return { tempoRestante };
}
