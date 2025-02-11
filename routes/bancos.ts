import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { verificaToken } from '../middlewares/verificaToken';

const prisma = new PrismaClient();
const router = Router();

export const bancoSchema = z.object({
  date: z.string().transform((val) => new Date(val)).optional(),
  account: z.enum(['CRESSOL', 'BANRISUL', 'IFOOD', 'STONE', 'CAIXA_FISICO']).optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
});

// Listar todos os bancos
router.get('/', verificaToken, async (req, res) => {
  try {
    const bancos = await prisma.banco.findMany();
    res.json(bancos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar bancos. ❌' });
  }
});

// Criar um novo banco com movimentação automática
router.post('/', async (req, res) => {
  const valida = bancoSchema.safeParse(req.body);

  if (!valida.success) {
    res.status(400).json({ erro: valida.error.issues.map((issue) => issue.message).join(', ') });
    return;
  }

  try {
    const novoBanco = await prisma.$transaction(async (prisma) => {
      // Cria o banco
      const banco = await prisma.banco.create({
        data: valida.data,
      });

      // Cria uma movimentação associada ao banco
      const movimentacao = await prisma.movimentacoes.create({
        data: {
          date: banco.date || new Date(),
          description: `Movimentação automática para ${banco.account}`,
          account: banco.account,
          amount: banco.amount || 0,
          tipo: 'ENTRADA', // Assume que é uma entrada
          creditoId: banco.id, // Associa ao banco criado
        },
      });

      return { banco, movimentacao };
    });

    res.status(201).json(novoBanco);
  } catch (error) {
    console.error('Erro ao criar banco e movimentação:', error);
    res.status(500).json({ erro: 'Erro ao criar banco e movimentação.' });
  }
});

// Atualizar um banco
router.patch('/:id', verificaToken, async (req, res) => {
  const id = Number(req.params.id);
  const valida = bancoSchema.safeParse(req.body);

  if (!valida.success) {
    res.status(400).json({ erro: valida.error.issues.map((issue) => issue.message).join(', ') + ' ❌' });
    return;
  }

  try {
    const banco = await prisma.banco.update({
      where: { id },
      data: valida.data,
    });
    res.json(banco);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar banco. ❌' });
  }
});

// Deletar um banco
router.delete('/:id', verificaToken, async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.banco.delete({
      where: { id },
    });
    res.json({ mensagem: 'Banco removido com sucesso. ✅' });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao remover banco. ❌' });
  }
});

export default router;
