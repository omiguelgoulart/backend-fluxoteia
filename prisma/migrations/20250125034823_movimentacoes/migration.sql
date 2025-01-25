/*
  Warnings:

  - You are about to drop the column `valor` on the `despesas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "despesas" DROP COLUMN "valor",
ADD COLUMN     "amount" DOUBLE PRECISION;
