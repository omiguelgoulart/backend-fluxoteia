import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { enviaEmail } from "../utils/enviaEmail";
import { gerarCodigoAleatorio } from "../utils/geraCodigo";
import { verificaCodigoRecuperacao } from "../middlewares/verificaCodigoRecuperacao";
import validaSenha from '../utils/validaSenha'
import { verificaBloqueio } from "../middlewares/verificaBloqueio";
import { mensagemBoasVindas } from "../utils/menssagem";

const prisma = new PrismaClient()
const router = Router()

async function autenticarUsuario(email: string, senha: string) {
  const usuario = await prisma.usuario.findFirst({ where: { email } });
  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return null;
  }
  return usuario;
}

async function atualizarLoginBemSucedido(usuario: any) {
  await prisma.usuario.update({
    where: { email: usuario.email },
    data: {
      tentativasLogin: 0,
      bloqueadoAte: null,
    },
  });
}

async function tratarTentativaInvalida(usuario: any) {
  const tentativasInvalidas = (usuario.tentativasLogin ?? 0) + 1;
  let bloqueadoAte: Date | null = null;

  if (tentativasInvalidas >= 3) {
    bloqueadoAte = new Date();
    bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + 60);
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      tentativasLogin: tentativasInvalidas,
      bloqueadoAte,
    },
  });

  await prisma.log.create({
    data: {
      descricao: "Tentativa de Acesso Inválida",
      complemento: `Email ${usuario.email}`,
      usuarioId: usuario.id,
    },
  });

  return bloqueadoAte;
}

router.post("/", verificaBloqueio, async (req, res) => {
  const { email, senha } = req.body;
  const mensagemPadrao = "Login ou senha incorretos";

  if (!email || !senha) {
    res.status(400).json({ erro: mensagemPadrao });
    return;
  }

  try {
    const usuario = await autenticarUsuario(email, senha);

    if (usuario) {
      const boasVindas = mensagemBoasVindas(usuario);
      await atualizarLoginBemSucedido(usuario);

      const token = jwt.sign(
        { userLogadoId: usuario.id, userLogadoNome: usuario.nome },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        mensagem: boasVindas,
        token,
      });
      return;
    } else {
      const usuarioExistente = await prisma.usuario.findFirst({ where: { email } });

      if (usuarioExistente) {
        const bloqueadoAte = await tratarTentativaInvalida(usuarioExistente);

        res.status(400).json({
          erro: mensagemPadrao,
          ...(bloqueadoAte && {
            mensagem: "Usuário bloqueado após múltiplas tentativas inválidas.",
            tempoRestante: Math.ceil((bloqueadoAte.getTime() - new Date().getTime()) / 60),
          }),
        });
        return;
      }

      res.status(400).json({ erro: mensagemPadrao });
      return;
    }
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ erro: "Erro ao processar login." });
    return;
  }
});

router.post("/recupera-senha", async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      res.status(404).json({ error: "E-mail não encontrado" });
      return;
    }

    const codigo = gerarCodigoAleatorio();
    const expiraEm = new Date();
    expiraEm.setMinutes(expiraEm.getMinutes() + 10);

    await prisma.usuario.update({
      where: { email },
      data: {
        resetToken: codigo,
        resetTokenExpires: expiraEm,
      },
    });

    await enviaEmail(email, usuario.nome, codigo);

    res.status(200).json({ message: "E-mail enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao processar solicitação:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

router.patch("/recupera-senha", verificaCodigoRecuperacao, async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      res.status(400).json({ error: "E-mail e nova senha são obrigatórios" });
      return;
    }

    // Valida a nova senha
    const erros = validaSenha(senha);
    if (erros.length > 0) {
      res.status(400).json({ error: erros.join("; ") });
      return;
    }


    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

   
    await prisma.usuario.update({
      where: { email },
      data: {
        senha: senhaHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ error: "Erro ao redefinir senha. Tente novamente mais tarde." });
  }
});



export default router
