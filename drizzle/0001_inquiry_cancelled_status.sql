-- Nowy status: anulowane przez klienta
ALTER TABLE `inquiries`
  MODIFY COLUMN `status` enum('new','in_progress','closed','cancelled_by_client') NOT NULL DEFAULT 'new';
