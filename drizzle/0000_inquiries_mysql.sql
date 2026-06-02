CREATE TABLE `inquiries` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`public_id` varchar(12) NOT NULL,
	`guest_password_hash` varchar(255) NOT NULL,
	`inquiry_type` enum('individual','premium','basic','contact') NOT NULL,
	`status` enum('new','in_progress','closed') NOT NULL DEFAULT 'new',
	`client_email` varchar(255) NOT NULL,
	`client_phone` varchar(30),
	`contact_full_name` varchar(120),
	`contact_message` text,
	`bride_name` varchar(120),
	`groom_name` varchar(120),
	`wedding_date` date,
	`ceremony_location` varchar(500),
	`reception_location` varchar(500),
	`schedule_notes` text,
	`lodging_info` text,
	`afterparty_info` text,
	`guest_info` text,
	`color_preferences` text,
	`mood_climate` text,
	`themes_motifs` text,
	`suggestions` text,
	`additional_info` text,
	`correction_requests` text,
	`template_name` varchar(120),
	`wants_qr_code` boolean,
	`qr_code_notes` text,
	`wants_rsvp` boolean,
	`rsvp_notes` text,
	`wants_password_protection` boolean,
	`wants_gallery` boolean,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`),
	CONSTRAINT `inquiries_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_email` ON `inquiries` (`client_email`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_type` ON `inquiries` (`inquiry_type`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_status` ON `inquiries` (`status`);--> statement-breakpoint
CREATE TABLE `inquiry_attachments` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`inquiry_id` bigint unsigned NOT NULL,
	`attachment_kind` enum('inspiration','couple_photo','contact_file') NOT NULL,
	`stored_name` varchar(255) NOT NULL,
	`original_name` varchar(255) NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`byte_size` bigint unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `inquiry_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiry_messages` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`inquiry_id` bigint unsigned NOT NULL,
	`author_role` enum('guest','staff') NOT NULL,
	`body` text NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `inquiry_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `inquiry_attachments` ADD CONSTRAINT `inquiry_attachments_inquiry_id_inquiries_id_fk` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiry_messages` ADD CONSTRAINT `inquiry_messages_inquiry_id_inquiries_id_fk` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON DELETE cascade ON UPDATE no action;
