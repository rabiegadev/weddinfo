-- Pełna migracja Weddinfo (kompatybilna z phpMyAdmin — bez markerów Drizzle)
-- Użyj tylko na pustej bazie. Jeśli masz już tabelę inquiries, użyj: 0000_inquiries_remaining.sql

CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_id` varchar(12) NOT NULL,
  `guest_password_hash` varchar(255) NOT NULL,
  `inquiry_type` enum('individual','premium','basic','contact') NOT NULL,
  `status` enum('new','in_progress','closed') NOT NULL DEFAULT 'new',
  `client_email` varchar(255) NOT NULL,
  `client_phone` varchar(30) DEFAULT NULL,
  `contact_full_name` varchar(120) DEFAULT NULL,
  `contact_message` text DEFAULT NULL,
  `bride_name` varchar(120) DEFAULT NULL,
  `groom_name` varchar(120) DEFAULT NULL,
  `wedding_date` date DEFAULT NULL,
  `ceremony_location` varchar(500) DEFAULT NULL,
  `reception_location` varchar(500) DEFAULT NULL,
  `schedule_notes` text DEFAULT NULL,
  `lodging_info` text DEFAULT NULL,
  `afterparty_info` text DEFAULT NULL,
  `guest_info` text DEFAULT NULL,
  `color_preferences` text DEFAULT NULL,
  `mood_climate` text DEFAULT NULL,
  `themes_motifs` text DEFAULT NULL,
  `suggestions` text DEFAULT NULL,
  `additional_info` text DEFAULT NULL,
  `correction_requests` text DEFAULT NULL,
  `template_name` varchar(120) DEFAULT NULL,
  `wants_qr_code` tinyint(1) DEFAULT NULL,
  `qr_code_notes` text DEFAULT NULL,
  `wants_rsvp` tinyint(1) DEFAULT NULL,
  `rsvp_notes` text DEFAULT NULL,
  `wants_password_protection` tinyint(1) DEFAULT NULL,
  `wants_gallery` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inquiries_public_id_unique` (`public_id`),
  KEY `idx_inquiries_email` (`client_email`),
  KEY `idx_inquiries_type` (`inquiry_type`),
  KEY `idx_inquiries_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
