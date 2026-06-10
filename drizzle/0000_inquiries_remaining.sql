-- Uzupełnienie po częściowym imporcie (gdy inquiries już istnieje, brakuje reszty)
-- Wklej w phpMyAdmin → SQL → Wykonaj

-- Indeksy (jeśli któryś już istnieje, phpMyAdmin pokaże błąd — możesz go pominąć)
CREATE INDEX `idx_inquiries_email` ON `inquiries` (`client_email`);
CREATE INDEX `idx_inquiries_type` ON `inquiries` (`inquiry_type`);
CREATE INDEX `idx_inquiries_status` ON `inquiries` (`status`);

CREATE TABLE IF NOT EXISTS `inquiry_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `inquiry_id` bigint unsigned NOT NULL,
  `attachment_kind` enum('inspiration','couple_photo','contact_file') NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `byte_size` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inquiry_attachments_inquiry_id_inquiries_id_fk` (`inquiry_id`),
  CONSTRAINT `inquiry_attachments_inquiry_id_inquiries_id_fk` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inquiry_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `inquiry_id` bigint unsigned NOT NULL,
  `author_role` enum('guest','staff') NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inquiry_messages_inquiry_id_inquiries_id_fk` (`inquiry_id`),
  CONSTRAINT `inquiry_messages_inquiry_id_inquiries_id_fk` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
