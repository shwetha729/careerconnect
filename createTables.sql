CREATE TABLE `attendees` (
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comments` text,
  PRIMARY KEY (`event_id`,`user_id`),
  KEY `event_id_idx` (`event_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `time_begin` datetime DEFAULT NULL,
  `time_end` datetime DEFAULT NULL,
  `location` text,
  PRIMARY KEY (`event_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` text NOT NULL,
  `body` text NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `topic_id_idx` (`topic_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `topic_id` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `replies` (
  `reply_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` text NOT NULL,
  `body` text NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reply_id`),
  KEY `post_id_idx` (`post_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`),
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `topics` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `subj` varchar(255) DEFAULT NULL,
  `body` text,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(32) NOT NULL,
  `lastname` varchar(32) NOT NULL,
  `password` varchar(255) NOT NULL,
  `location` varchar(32) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `permission` int DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
