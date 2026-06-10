-- Liczniki rate-limit / anty-brute-force (okno stałe)
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `bucket` varchar(191) NOT NULL,
  `count` int NOT NULL DEFAULT 0,
  `window_started_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`bucket`)
);
