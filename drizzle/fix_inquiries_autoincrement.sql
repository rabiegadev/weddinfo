-- Naprawa tabeli inquiries po częściowym imporcie Drizzle
-- Uruchom w phpMyAdmin, jeśli INSERT zwraca błąd o braku DEFAULT dla id

ALTER TABLE `inquiries`
  MODIFY COLUMN `id` bigint unsigned NOT NULL AUTO_INCREMENT;

ALTER TABLE `inquiry_attachments`
  MODIFY COLUMN `id` bigint unsigned NOT NULL AUTO_INCREMENT;

ALTER TABLE `inquiry_messages`
  MODIFY COLUMN `id` bigint unsigned NOT NULL AUTO_INCREMENT;
