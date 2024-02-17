-- AlterTable
ALTER TABLE `register` ADD COLUMN `admision` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `observations` TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `role` MODIFY `name` ENUM('ADMIN', 'SUPERVISOR', 'ADVISOR', 'GUEST') NOT NULL;
