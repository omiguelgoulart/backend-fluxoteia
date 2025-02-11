-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "account" "ACCOUNT",
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "STATUS",
    "tipo" "TipoMovimentacao" NOT NULL,
    "creditoId" INTEGER,
    "debitoId" INTEGER,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_creditoId_fkey" FOREIGN KEY ("creditoId") REFERENCES "bancos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_debitoId_fkey" FOREIGN KEY ("debitoId") REFERENCES "despesas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
