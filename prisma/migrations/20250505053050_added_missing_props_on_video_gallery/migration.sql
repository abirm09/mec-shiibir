/*
  Warnings:

  - You are about to drop the column `videoId` on the `video_galleries` table. All the data in the column will be lost.
  - Added the required column `ytVideoId` to the `video_galleries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ytVideoLink` to the `video_galleries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `video_galleries` DROP COLUMN `videoId`,
    ADD COLUMN `ytVideoId` VARCHAR(191) NOT NULL,
    ADD COLUMN `ytVideoLink` LONGTEXT NOT NULL;
