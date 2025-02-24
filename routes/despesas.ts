import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import {  z } from 'zod';
import { verificaToken } from '../middlewares/verificaToken';

const prisma = new PrismaClient();
const router = Router();

// Validação com Zod para criar ou atualizar uma despesa
const despesaSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' }).optional(),
  number: z.string().optional(),
  description: z.string().min(3, { message: 'Descrição deve ter no mínimo 3 caracteres' }).optional(),
  account: z.enum(['CRESSOL', 'BANRISUL', 'IFOOD', 'STONE', 'CAIXA_FISICO']).optional(),
  category: z.enum([
    'CUSTOS_OPERACAO',
    'DESPESAS_FIXAS',
    'DESPESAS_VARIAVEIS',
    'DESPESAS_ADMINISTRATIVAS',
    'OUTRAS_DESPESAS',
    'IMPOSTOS_CONTRIBUICOES',
    'OUTRAS_RECEITAS',
  ]).optional(),
  subcategory: z.string().min(3, { message: 'Subcategoria deve ter no mínimo 3 caracteres' }).optional(),
  amount: z.number().positive({ message: 'Valor deve ser maior que zero' }).optional(),
  status: z.enum(['PENDENTE', 'PAGO']).optional(),
});

// GET - Listar todas as despesas
router.get('/', async (req, res) => {
  try {
    const despesas = await prisma.despesas.findMany();
    res.json(despesas);
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    res.status(500).json({ error: 'Erro ao buscar despesas' });
  }
});

// POST - Criar uma nova despesa
router.post('/', verificaToken, async (req, res) => {
  try {
    const validaDespesas = despesaSchema.safeParse(req.body);

    if (!validaDespesas.success) {
      res.status(400).json({ erro: validaDespesas.error.errors });
      return;
    }

    // Cria a despesa e a movimentação em uma transação
    const novaDespesa = await prisma.$transaction(async (prisma) => {
      // Cria a despesa
      const despesa = await prisma.despesas.create({
        data: validaDespesas.data,
      });

      // Cria a movimentação relacionada
      await prisma.movimentacoes.create({
        data: {
          date: validaDespesas.data.date ? new Date(validaDespesas.data.date) : new Date(),
          description: validaDespesas.data.description || `Movimentação para despesa ${despesa.id}`,
          account: validaDespesas.data.account,
          amount: validaDespesas.data.amount || 0,
          status: validaDespesas.data.status || 'PENDENTE',
          tipo: 'SAIDA', // Despesas são do tipo SAIDA
          debitoId: despesa.id, // Associa à despesa criada
        },
      });

      return despesa;
    });

    res.status(201).json(novaDespesa);
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    res.status(500).json({ error: 'Erro ao criar despesa' });
  }
});

// PATCH - Atualizar uma despesa específica
router.patch('/:id', verificaToken, async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    const data = despesaSchema.partial().parse(req.body);

    // Atualiza a despesa e a movimentação em uma transação
    const despesaAtualizada = await prisma.$transaction(async (prisma) => {
      // Atualiza a despesa
      const despesa = await prisma.despesas.update({
        where: { id: Number(id) },
        data,
      });

      // Atualiza a movimentação relacionada
      await prisma.movimentacoes.updateMany({
        where: { debitoId: Number(id) },
        data: {
          date: data.date ? new Date(data.date) : undefined,
          description: data.description,
          account: data.account,
          amount: data.amount,
          status: data.status,
        },
      });

      return despesa;
    });

    res.json(despesaAtualizada);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Erro de validação',
        detalhes: error.errors,
      });
      return;
    }
    console.error('Erro ao atualizar despesa:', error);
    res.status(500).json({ error: 'Erro ao atualizar despesa' });
  }
});

// DELETE - Excluir uma despesa específica
router.delete('/:id', verificaToken, async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    // Exclui a despesa e a movimentação em uma transação
    await prisma.$transaction(async (prisma) => {
      // Remove a movimentação relacionada (se existir)
      await prisma.movimentacoes.deleteMany({
        where: { debitoId: Number(id) },
      });

      // Exclui a despesa
      await prisma.despesas.delete({
        where: { id: Number(id) },
      });
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir despesa:', error);
    res.status(500).json({ error: 'Erro ao excluir despesa' });
  }
});

export default router;
