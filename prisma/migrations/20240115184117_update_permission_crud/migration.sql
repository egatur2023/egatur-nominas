/*
  Warnings:

  - You are about to drop the column `action` on the `permission` table. All the data in the column will be lost.
  - Added the required column `create` to the `permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delete` to the `permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `read` to the `permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update` to the `permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `permission` DROP COLUMN `action`,
    ADD COLUMN `create` BOOLEAN NOT NULL,
    ADD COLUMN `delete` BOOLEAN NOT NULL,
    ADD COLUMN `read` BOOLEAN NOT NULL,
    ADD COLUMN `update` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `register` MODIFY `observations` TEXT NOT NULL DEFAULT '';
