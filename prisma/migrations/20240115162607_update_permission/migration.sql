/*
  Warnings:

  - Added the required column `moduleId` to the `permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `permission` ADD COLUMN `moduleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `register` MODIFY `observations` TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `modulesystem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `attendance_subscriptionRoomId_idx` ON `attendance`(`subscriptionRoomId`);

-- CreateIndex
CREATE INDEX `request_subscriptionRoomId_idx` ON `request`(`subscriptionRoomId`);

-- CreateIndex
CREATE INDEX `request_userId_idx` ON `request`(`userId`);
