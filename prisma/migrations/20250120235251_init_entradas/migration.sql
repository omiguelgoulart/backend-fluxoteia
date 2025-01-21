/*
  Warnings:

  - You are about to drop the `entradas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `entradas`;

-- CreateTable
CREATE TABLE `entrada` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dinheiro` DOUBLE NULL,
    `debito` DOUBLE NULL,
    `pix` DOUBLE NULL,
    `ifood` DOUBLE NULL,
    `credito` DOUBLE NULL,
    `maquinaCredito` DOUBLE NULL,
    `maquinaDebito` DOUBLE NULL,
    `voucher` DOUBLE NULL,
    `total` DOUBLE NOT NULL,
    `numeroPessoas` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
