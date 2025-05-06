-- CreateTable
CREATE TABLE `scholarship_application_departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `scholarship_application_departments_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scholarship_application_halls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `scholarship_application_halls_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scholarship_applications` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `applicationSubject` VARCHAR(191) NOT NULL,
    `session` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `reference1` VARCHAR(191) NULL,
    `reference2` VARCHAR(191) NULL,
    `problemDetails` LONGTEXT NOT NULL,
    `approvedByUserId` VARCHAR(191) NULL,
    `status` ENUM('pending', 'approved') NOT NULL DEFAULT 'pending',
    `departmentId` INTEGER NOT NULL,
    `hallId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `scholarship_applications_requestId_key`(`requestId`),
    INDEX `scholarship_applications_requestId_idx`(`requestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `scholarship_applications` ADD CONSTRAINT `scholarship_applications_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `scholarship_application_departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scholarship_applications` ADD CONSTRAINT `scholarship_applications_hallId_fkey` FOREIGN KEY (`hallId`) REFERENCES `scholarship_application_halls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scholarship_applications` ADD CONSTRAINT `scholarship_applications_approvedByUserId_fkey` FOREIGN KEY (`approvedByUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
