import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Endpoint para listar movimentações
router.get('/', async (req, res) => {
  try {
    const movimentacoes = await prisma.movimentacoes.findMany({
      include: {
        despesa: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(movimentacoes);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({ error: 'Erro ao buscar movimentações' });
  }
});

export default router;
