import { PrismaClient } from '@prisma/client';
import { Router} from 'express';
import { number, z } from 'zod';
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
  amount : z.number().positive({ message: 'Valor deve ser maior que zero' }).optional(), // Deve aceitar "value"
  status: z.enum(['PENDENTE', 'PAGO']).optional(),
});


// GET - Listar todas as despesas
router.get('/', async (req, res ) => {
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
    console.log('Payload recebido:', req.body); // Adicione este log
    const data = despesaSchema.parse(req.body); // Valida com Zod
    console.log('Dados validados pelo Zod:', data); // Adicione este log

    const payload = {
      date: data.date ? new Date(data.date) : undefined,
      number: data.number ?? null,
      description: data.description ?? undefined,
      account: data.account ?? null,
      category: data.category ?? null,
      subcategory: data.subcategory ?? null,
      valor: data.amount ?? null, // Mapear corretamente para o banco
      status: data.status ?? null,
    };

    console.log('Payload para o Prisma:', payload); // Adicione este log
    const novaDespesa = await prisma.despesas.create({
      data: payload,
    });

    console.log('Despesa criada com sucesso:', novaDespesa);
    res.status(201).json(novaDespesa);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      res.status(400).json({
        error: 'Erro de validação',
        detalhes: error.errors,
      });
      return;
    }
    console.error('Erro ao criar despesa:', error); // Mostra o erro detalhado
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
    // Validação com Zod (partial permite campos opcionais)
    const data = despesaSchema.partial().parse(req.body);

    const despesaAtualizada = await prisma.despesas.update({
      where: { id: Number(id) },
      data,
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
    await prisma.despesas.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir despesa:', error);
    res.status(500).json({ error: 'Erro ao excluir despesa' });
  }
});

export default router;
