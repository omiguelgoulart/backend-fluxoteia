import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { z } from 'zod'
import validaSenha from '../utils/validaSenha'

const prisma = new PrismaClient()
const router = Router()

export const usuarioSchema = z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(6),
})

  

router.get('/', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany()
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
})

router.post("/", async (req, res) => {

    const valida = usuarioSchema.safeParse(req.body)
    if (!valida.success) {
      res.status(400).json({ erro: valida.error })
      return
    }
  
    const erros = validaSenha(valida.data.senha)
    if (erros.length > 0) {
      res.status(400).json({ erro: erros.join("; ") })
      return
    }
  
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(valida.data.senha, salt)
  
    try {
      const usuario = await prisma.usuario.create({
        data: { ...valida.data, senha: hash }
      })
      res.status(201).json(usuario)
    } catch (error) {
      res.status(400).json(error)
    }
  })

  
router.patch("/:id", async (req, res) => {
    const id = Number(req.params.id)
    const valida = usuarioSchema.safeParse(req.body)
    if (!valida.success) {
      res.status(400).json({ erro: valida.error })
      return
    }
  
    try {
      const usuario = await prisma.usuario.update({
        where: { id },
        data: valida.data
      })
      res.json(usuario)
    } catch (error) {
      res.status(400).json(error)
    }
  })

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id)
    try {
      await prisma.usuario.delete({
        where: { id }
      })
      res.json({ mensagem: "Usuário removido com sucesso" })
    } catch (error) {
      res.status(400).json(error)
    }
  })  

export default router