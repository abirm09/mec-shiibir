-- AlterTable
ALTER TABLE `scholarship_applications` MODIFY `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending';
