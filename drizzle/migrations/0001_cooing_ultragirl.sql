ALTER TABLE `author` RENAME COLUMN `name` TO `author`;--> statement-breakpoint
ALTER TABLE `publisher` RENAME COLUMN `name` TO `publisher`;--> statement-breakpoint
DROP INDEX IF EXISTS `author_name_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `publisher_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `author_author_unique` ON `author` (`author`);--> statement-breakpoint
CREATE UNIQUE INDEX `publisher_publisher_unique` ON `publisher` (`publisher`);