CREATE TABLE `competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`description` text,
	`category` enum('Cultural/Core','Soft Skil') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badge` varchar(50) NOT NULL,
	`sector` varchar(100) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`positionId` int NOT NULL,
	`birthDate` date,
	`admissionDate` date NOT NULL,
	`leaderId` int,
	`lastAccessAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_badge_unique` UNIQUE(`badge`),
	CONSTRAINT `employees_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `evaluationCycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`status` enum('planning','in_progress','completed') NOT NULL DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluationCycles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluationScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`competencyId` int NOT NULL,
	`weight` int NOT NULL,
	`score` int NOT NULL,
	`weightedScore` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluationScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycleId` int NOT NULL,
	`evaluatedEmployeeId` int NOT NULL,
	`evaluatorId` int NOT NULL,
	`status` enum('draft','submitted','completed') NOT NULL DEFAULT 'draft',
	`totalScore` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nineBoxes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`employeeId` int NOT NULL,
	`performance` int NOT NULL,
	`potential` int NOT NULL,
	`classification` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nineBoxes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pdis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`employeeId` int NOT NULL,
	`strengths` text,
	`improvementAreas` text,
	`developmentPlan` text,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pdis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `positionCompetencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`positionId` int NOT NULL,
	`competencyId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `positionCompetencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` text,
	`requirements` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `positions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('master','leader','employee') NOT NULL DEFAULT 'employee';--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `loginMethod`;