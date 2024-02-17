/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `register` MODIFY `observations` TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('ADMIN', 'SUPERVISOR', 'ADVISOR') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `action` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RenameIndex
ALTER TABLE `career` RENAME INDEX `Career_name_idx` TO `career_name_idx`;

-- RenameIndex
ALTER TABLE `career` RENAME INDEX `Career_name_key` TO `career_name_key`;

-- RenameIndex
ALTER TABLE `course` RENAME INDEX `Course_name_idx` TO `course_name_idx`;

-- RenameIndex
ALTER TABLE `module` RENAME INDEX `Module_name_idx` TO `module_name_idx`;

-- RenameIndex
ALTER TABLE `student` RENAME INDEX `Student_dni_key` TO `student_dni_key`;

-- RenameIndex
ALTER TABLE `teacher` RENAME INDEX `Teacher_dni_key` TO `teacher_dni_key`;

-- RenameIndex
ALTER TABLE `teacher` RENAME INDEX `Teacher_fullName_idx` TO `teacher_fullName_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_idx` TO `user_email_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;
