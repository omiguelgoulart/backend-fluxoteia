/*
  Warnings:

  - You are about to drop the column `amount` on the `despesas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "despesas" DROP COLUMN "amount",
ADD COLUMN     "valor" DOUBLE PRECISION;
