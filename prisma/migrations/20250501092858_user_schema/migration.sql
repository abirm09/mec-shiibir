-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `needsPasswordChange` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('superAdmin', 'admin') NOT NULL DEFAULT 'admin',
    `status` ENUM('active', 'deleted', 'banned') NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sessionTokenId` VARCHAR(191) NULL,

    UNIQUE INDEX `users_userId_key`(`userId`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_userId_idx`(`email`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
