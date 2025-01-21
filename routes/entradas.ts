import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { verificaToken } from '../middlewares/verificaToken';

const prisma = new PrismaClient();
const router = Router();

// Validação com Zod para criar ou atualizar uma entrada
const entradaSchema = z.object({
  data: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' }),
  dinheiro: z.number().nonnegative(),
  debito: z.number().nonnegative(),
  pix: z.number().nonnegative(),
  ifood: z.number().nonnegative(),
  credito: z.number().nonnegative(),
  maquinaCredito: z.number().nonnegative(),
  maquinaDebito: z.number().nonnegative(),
  voucher: z.number().nonnegative(),
  total: z.number().nonnegative(), // Campo obrigatório
  numeroPessoas: z.number().int().nonnegative(),
});

// GET - Listar todas as entradas
router.get('/', async (req, res) => {
  try {
    const entradas = await prisma.entrada.findMany();
    res.json(entradas);
  } catch (error) {
    console.error('Erro ao buscar entradas:', error);
    res.status(500).json({ error: 'Erro ao buscar entradas' });
  }
});

// POST - Criar uma nova entrada
router.post('/', verificaToken, async (req, res) => {
  try {
    // Valida o payload usando o esquema
    const data = entradaSchema.parse(req.body);

    // Cria a entrada no banco de dados
    const novaEntrada = await prisma.entrada.create({
      data: {
        data: new Date(data.data), // Converte a data para Date
        dinheiro: data.dinheiro,
        debito: data.debito,
        pix: data.pix,
        ifood: data.ifood,
        credito: data.credito,
        maquinaCredito: data.maquinaCredito,
        maquinaDebito: data.maquinaDebito,
        voucher: data.voucher,
        total: data.total,
        numeroPessoas: data.numeroPessoas,
      },
    });

    res.status(201).json(novaEntrada);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Erro de validação',
        detalhes: error.errors,
      });
      return;
    }
    console.error('Erro ao criar entrada:', error);
    res.status(500).json({ error: 'Erro ao criar entrada' });
  }
});


// PATCH - Atualizar uma entrada específica
router.patch('/:id', verificaToken, async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    // Validação com Zod (partial permite campos opcionais)
    const data = entradaSchema.partial().parse(req.body);

    const entradaAtualizada = await prisma.entrada.update({
      where: { id: Number(id) },
      data,
    });

    res.json(entradaAtualizada);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Erro de validação',
        detalhes: error.errors,
      });
      return;
    }
    console.error('Erro ao atualizar entrada:', error);
    res.status(500).json({ error: 'Erro ao atualizar entrada' });
  }
});

// DELETE - Excluir uma entrada específica
router.delete('/:id', verificaToken, async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    await prisma.entrada.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir entrada:', error);
    res.status(500).json({ error: 'Erro ao excluir entrada' });
  }
});

export default router;
