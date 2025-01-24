-- CreateEnum
CREATE TYPE "ACCOUNT" AS ENUM ('CRESSOL', 'BANRISUL', 'IFOOD', 'STONE', 'CAIXA_FISICO');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDENTE', 'PAGO');

-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('CUSTOS_OPERACAO', 'DESPESAS_FIXAS', 'DESPESAS_VARIAVEIS', 'DESPESAS_ADMINISTRATIVAS', 'OUTRAS_DESPESAS', 'IMPOSTOS_CONTRIBUICOES', 'OUTRAS_RECEITAS');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "bloqueadoAte" TIMESTAMP(3),
    "tentativasLogin" INTEGER DEFAULT 0,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(60) NOT NULL,
    "complemento" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despesas" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "number" TEXT,
    "description" TEXT,
    "account" "ACCOUNT",
    "category" "CATEGORY",
    "subcategory" TEXT,
    "value" DOUBLE PRECISION,
    "status" "STATUS",

    CONSTRAINT "despesas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrada" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dinheiro" DOUBLE PRECISION,
    "debito" DOUBLE PRECISION,
    "pix" DOUBLE PRECISION,
    "ifood" DOUBLE PRECISION,
    "credito" DOUBLE PRECISION,
    "maquinaCredito" DOUBLE PRECISION,
    "maquinaDebito" DOUBLE PRECISION,
    "voucher" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "numeroPessoas" INTEGER,

    CONSTRAINT "entrada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
