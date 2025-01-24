/*
  Warnings:

  - You are about to drop the column `value` on the `Movimentacoes` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `despesas` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Movimentacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movimentacoes" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "despesas" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION;
