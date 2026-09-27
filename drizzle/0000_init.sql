CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`sort` int NOT NULL DEFAULT 0,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`whatsapp` varchar(30) NOT NULL,
	`email` varchar(191),
	`subject` varchar(191),
	`message` text NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(140) NOT NULL,
	`region` enum('INDONESIA','ASIA','EROPA','TIMUR_TENGAH','AFRIKA','AMERIKA','LAINNYA') NOT NULL,
	`country` varchar(120),
	`image` varchar(500),
	`description` text,
	`information` text,
	`best_time` varchar(255),
	`travel_tips` text,
	`featured` boolean NOT NULL DEFAULT false,
	`sort` int NOT NULL DEFAULT 0,
	`seo_title` varchar(191),
	`meta_description` varchar(300),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `destinations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`group` enum('Booking','Payment','Tour','Visa','Hotel','Cancellation','Refund','General') NOT NULL DEFAULT 'General',
	`question` varchar(300) NOT NULL,
	`answer` text NOT NULL,
	`sort` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` enum('FOTO','VIDEO_TOUR','VIDEO_TESTIMONI') NOT NULL,
	`category` varchar(60),
	`title` varchar(191),
	`image_url` varchar(500) NOT NULL,
	`video_url` varchar(500),
	`sort` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`package_id` int NOT NULL,
	`day_no` int NOT NULL,
	`title` varchar(191) NOT NULL,
	`items` json,
	`hotel` varchar(191),
	`transport` varchar(191),
	CONSTRAINT `itinerary_days_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `legal_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`number` varchar(120),
	`file_url` varchar(500),
	`sort` int NOT NULL DEFAULT 0,
	CONSTRAINT `legal_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `package_destinations` (
	`package_id` int NOT NULL,
	`destination_id` int NOT NULL,
	CONSTRAINT `package_destinations_package_id_destination_id_pk` PRIMARY KEY(`package_id`,`destination_id`)
);
--> statement-breakpoint
CREATE TABLE `package_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`package_id` int NOT NULL,
	`url` varchar(500) NOT NULL,
	`caption` varchar(191),
	`sort` int NOT NULL DEFAULT 0,
	CONSTRAINT `package_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(40),
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`category_id` int,
	`duration_days` int NOT NULL,
	`countries_label` varchar(60),
	`departure_label` varchar(60),
	`summary` varchar(300),
	`description` text,
	`price` bigint NOT NULL,
	`promo_price` bigint,
	`child_price` bigint,
	`single_supplement` bigint,
	`deposit` bigint,
	`thumbnail` varchar(500) NOT NULL,
	`video_url` varchar(500),
	`rating` decimal(2,1),
	`badge` enum('HOT DEAL','BEST SELLER','POPULAR','FAVORITE','PROMO'),
	`featured` boolean NOT NULL DEFAULT false,
	`status` enum('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
	`includes` json,
	`excludes` json,
	`hotels` json,
	`transports` json,
	`terms` json,
	`sort` int NOT NULL DEFAULT 0,
	`seo_title` varchar(191),
	`meta_description` varchar(300),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `packages_id` PRIMARY KEY(`id`),
	CONSTRAINT `packages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`logo` varchar(500) NOT NULL,
	`url` varchar(500),
	`sort` int NOT NULL DEFAULT 0,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`package_id` int NOT NULL,
	`departure_date` date NOT NULL,
	`return_date` date,
	`quota` int,
	`seats_left` int,
	`status` enum('OPEN','LIMITED','FULL','SOLD_OUT','CLOSED') NOT NULL DEFAULT 'OPEN',
	`note` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(64) NOT NULL,
	`value` json NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`position` varchar(120) NOT NULL,
	`bio` text,
	`photo` varchar(500),
	`sort` int NOT NULL DEFAULT 0,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`photo` varchar(500),
	`package_id` int,
	`package_label` varchar(191),
	`rating` int NOT NULL DEFAULT 5,
	`review` text NOT NULL,
	`video_url` varchar(500),
	`date` date,
	`status` enum('DRAFT','PUBLISHED','HIDDEN') NOT NULL DEFAULT 'DRAFT',
	`featured` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('SUPER_ADMIN','ADMIN') NOT NULL DEFAULT 'ADMIN',
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `itinerary_days` ADD CONSTRAINT `itinerary_days_package_id_packages_id_fk` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `package_destinations` ADD CONSTRAINT `package_destinations_package_id_packages_id_fk` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `package_destinations` ADD CONSTRAINT `package_destinations_destination_id_destinations_id_fk` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `package_images` ADD CONSTRAINT `package_images_package_id_packages_id_fk` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `packages` ADD CONSTRAINT `packages_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_package_id_packages_id_fk` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_package_id_packages_id_fk` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `destinations_region_idx` ON `destinations` (`region`);--> statement-breakpoint
CREATE INDEX `packages_status_idx` ON `packages` (`status`);--> statement-breakpoint
CREATE INDEX `packages_category_idx` ON `packages` (`category_id`);--> statement-breakpoint
CREATE INDEX `schedules_package_idx` ON `schedules` (`package_id`);--> statement-breakpoint
CREATE INDEX `schedules_date_idx` ON `schedules` (`departure_date`);