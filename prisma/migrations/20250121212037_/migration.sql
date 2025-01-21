/*
  Warnings:

  - You are about to drop the column `valor` on the `despesas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `despesas` DROP COLUMN `valor`,
    ADD COLUMN `number` VARCHAR(191) NULL,
    ADD COLUMN `value` DOUBLE NULL,
    MODIFY `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `account` ENUM('CRESSOL', 'BANRISUL', 'IFOOD', 'STONE', 'CAIXA_FISICO') NULL,
    MODIFY `category` ENUM('CUSTOS_OPERACAO', 'DESPESAS_FIXAS', 'DESPESAS_VARIAVEIS', 'DESPESAS_ADMINISTRATIVAS', 'OUTRAS_DESPESAS', 'IMPOSTOS_CONTRIBUICOES', 'OUTRAS_RECEITAS') NULL,
    MODIFY `subcategory` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDENTE', 'PAGO') NULL;
