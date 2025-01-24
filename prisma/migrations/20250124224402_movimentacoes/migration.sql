-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "Movimentacoes" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "account" "ACCOUNT",
    "value" DOUBLE PRECISION NOT NULL,
    "status" "STATUS",
    "tipo" "TipoMovimentacao" NOT NULL,
    "entradaId" INTEGER,
    "despesaId" INTEGER,

    CONSTRAINT "Movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movimentacoes_entradaId_key" ON "Movimentacoes"("entradaId");

-- CreateIndex
CREATE UNIQUE INDEX "Movimentacoes_despesaId_key" ON "Movimentacoes"("despesaId");

-- AddForeignKey
ALTER TABLE "Movimentacoes" ADD CONSTRAINT "Movimentacoes_entradaId_fkey" FOREIGN KEY ("entradaId") REFERENCES "entrada"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacoes" ADD CONSTRAINT "Movimentacoes_despesaId_fkey" FOREIGN KEY ("despesaId") REFERENCES "despesas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
