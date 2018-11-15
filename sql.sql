/*
SQLyog Ultimate v11.5 (64 bit)
MySQL - 5.6.21 : Database - emojiquest
*********************************************************************
*/



USE `emojiquest`;

/*Table structure for table `encounters` */

DROP TABLE IF EXISTS `encounters`;

CREATE TABLE `encounters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fatigue` tinyint(4) DEFAULT NULL,
  `fatiguemin` tinyint(4) DEFAULT NULL,
  `fatigumax` tinyint(4) DEFAULT NULL,
  `emoji` blob,
  `text` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rarity` tinyint(4) DEFAULT NULL,
  `face` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `encounters` */

insert  into `encounters`(`id`,`fatigue`,`fatiguemin`,`fatigumax`,`emoji`,`text`,`rarity`,`face`) values (1,NULL,NULL,NULL,'????',NULL,NULL,'');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `x` tinyint(3) unsigned DEFAULT '0',
  `y` tinyint(3) unsigned DEFAULT '0',
  `fatigue` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`phone`,`name`,`x`,`y`,`fatigue`) values (10,'5033125056',NULL,13,22,0);

/*Table structure for table `zones` */

DROP TABLE IF EXISTS `zones`;

CREATE TABLE `zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `x` tinyint(3) unsigned DEFAULT NULL,
  `y` tinyint(3) unsigned DEFAULT NULL,
  `bg1` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bg2` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bg3` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encounter` int(11) DEFAULT NULL,
  `fatigue` tinyint(4) DEFAULT NULL,
  `minfatigue` tinyint(4) DEFAULT NULL,
  `layout` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `zones` */

insert  into `zones`(`id`,`x`,`y`,`bg1`,`bg2`,`bg3`,`encounter`,`fatigue`,`minfatigue`,`layout`) values (9,17,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌴🌴🌴🌴🌴🌴\n🌴🌴🌴🌴🌴🌴\n🌴🌴🌴🌴🌴🌴'),(11,19,0,NULL,NULL,NULL,NULL,NULL,NULL,'☘🌲🗻☘🌲☘\n☘🌲🗻☘🗻🌲\n☘☘🌲☘🗻🗻'),(33,18,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌼🥀🌼🌼🌼🥀\n🌼🥀🌼🌼🌻🌼\n🌻🌼🥀🌻🥀🌻'),(34,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'🗻🌲☘🌲☘🗻\n🗻☘🌲☘🌲☘\n🗻🌲🗻🗻☘🌲'),(35,20,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌲🌲🌲🌷⛰🌷\n⛰⛰🌲🌷🌷🌷\n🌲⛰🌷⛰🌷🌷'),(36,16,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌳⛰🌳🌳🌳🌳\n🌳⛰🌾🌾🌳⛰\n⛰🌾🌳🌳🌳🌳'),(37,15,0,NULL,NULL,NULL,NULL,NULL,NULL,'⛰⛰🌷🌷🌷⛰\n🌷🌷🌷⛰⛰⛰\n⛰⛰⛰⛰⛰⛰'),(38,14,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌴🌱🌱🌴🌴🌱\n🌱🌴🌴🌴🌴🌱\n🌴🏔🏔🌱🌴🏔'),(39,13,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌳🌻🌻🏔🌳🌳\n🌻🌳🌳🏔🏔🌳\n🌳🌳🏔🏔🌳🌳'),(40,12,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌲🏔🌲🌼🏔🌼\n🏔🏔🌲🏔🌼🌲\n🏔🌲🌲🌲🌼🌼'),(41,11,0,NULL,NULL,NULL,NULL,NULL,NULL,'🍀🍀🏔🍀🍀⛰\n🍀🏔⛰🏔🍀⛰\n🏔🍀⛰⛰🏔🍀'),(42,10,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌻🌵🌵🌻🌵🌵\n🌵🌻🌵🌵🌻🌵\n🌵🌵🌵🌵🌻🌵'),(43,9,0,NULL,NULL,NULL,NULL,NULL,NULL,'🍀🌼🌼🌼🍀🗻\n🍀🍀🌼🍀🌼🗻\n🍀🍀🗻🗻🌼🍀'),(44,8,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌼🌼🌲🌲⛰⛰\n⛰🌼⛰🌼🌼⛰\n🌼🌼⛰🌼⛰🌲'),(45,7,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌴🌷🌷🌴🌴🌴\n🗻🗻🗻🗻🗻🌷\n🌴🌷🗻🌷🌴🗻'),(46,6,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌾🌻🌱🌾🌾🌾\n🌻🌱🌻🌻🌻🌻\n🌻🌱🌻🌻🌾🌻'),(47,5,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌻🌻🥀🌻🥀🥀\n🥀🥀🥀🌻🥀🥀\n🥀🥀🌻🥀🥀🌻'),(48,4,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌾🗻🗻🗻🌱🌾\n🗻🌾🌱🌾🗻🌾\n🗻🌱🗻🌾🌾🌾'),(49,3,0,NULL,NULL,NULL,NULL,NULL,NULL,'🌻🌵🌻🌵🌵🌻\n🌻🌻🌻🌻🌻🌻\n🌵🌵🌻🌻🌵🌻'),(50,2,0,NULL,NULL,NULL,NULL,NULL,NULL,'🥀⛰🥀🥀⛰🌳\n🌳🌳🥀🌳🌳⛰\n🌳🌳🌳⛰🥀⛰'),(51,1,0,NULL,NULL,NULL,NULL,NULL,NULL,'⛰🌋🌋🌳🌳🌋\n🌋⛰⛰⛰🌳🌋\n🌳⛰🌳⛰⛰⛰'),(52,13,1,NULL,NULL,NULL,NULL,NULL,NULL,'🌾🌾🌋🌷🌾🌾\n🌾🌷🌾🌷🌷🌷\n🌾🌾🌾🌷🌷🌷'),(53,13,2,NULL,NULL,NULL,NULL,NULL,NULL,'🌷🌼🌼🌼🌼🌷\n🌷🌷🌷⛰🌷🌷\n⛰🌼🌼🌼🌼🌼'),(54,13,3,NULL,NULL,NULL,NULL,NULL,NULL,'🌾🌵🌾🌵🥀🌾\n🌵🥀🌾🥀🥀🌵\n🥀🥀🌵🌾🌵🌾'),(55,13,4,NULL,NULL,NULL,NULL,NULL,NULL,'🌻🏔🌻🌻🌵🌻\n🏔🌵🏔🌻🌵🌻\n🌻🌵🌵🌵🌻🌵'),(56,13,5,NULL,NULL,NULL,NULL,NULL,NULL,'🍀🏔🌵🏔🌵🌵\n🏔🍀🌵🍀🌵🌵\n🏔🍀🏔🍀🍀🍀'),(57,13,6,NULL,NULL,NULL,NULL,NULL,NULL,'🌲🗻🗻🌷🌲🌷\n🌲🌷🌷🌷🌲🌷\n🗻🌷🌲🗻🌷🌲'),(58,13,7,NULL,NULL,NULL,NULL,NULL,NULL,'🌻☘☘🌵🌻☘\n🌵☘☘☘🌵☘\n🌵🌻🌵🌵🌵☘'),(59,13,8,NULL,NULL,NULL,NULL,NULL,NULL,'🌼☘☘⛰⛰☘\n⛰🌼🌼🌼⛰🌼\n🌼⛰☘⛰🌼⛰'),(60,13,9,NULL,NULL,NULL,NULL,NULL,NULL,'🍀🌱🥀🍀🥀🥀\n🍀🍀🍀🥀🌱🍀\n🥀🥀🌱🌱🍀🌱'),(61,13,10,NULL,NULL,NULL,NULL,NULL,NULL,'🍀🌲🌋🌲🌲🌲\n🌋🌲🍀🍀🌋🌲\n🍀🌲🌲🌲🌲🌲'),(62,13,11,NULL,NULL,NULL,NULL,NULL,NULL,'🥀🌲🌲🌲🌱🥀\n🥀🌱🌱🥀🌲🥀\n🌱🌲🌲🌲🌲🌱'),(63,13,12,NULL,NULL,NULL,NULL,NULL,NULL,'🌲🌾🌲🌲🌾🌲\n🌾🌼🌼🌲🌲🌲\n🌾🌼🌲🌼🌾🌾'),(64,13,13,NULL,NULL,NULL,NULL,NULL,NULL,'🌵🌵🌱🌱🌱🌵\n🌾🌵🌱🌵🌵🌾\n🌱🌱🌾🌵🌱🌵'),(65,13,14,NULL,NULL,NULL,NULL,NULL,NULL,'🌴🌱🌱🌲🌴🌴\n🌴🌱🌲🌴🌱🌱\n🌲🌱🌲🌴🌲🌲'),(66,13,15,NULL,NULL,NULL,NULL,NULL,NULL,'🌼🍀🍀🌼🥀🥀\n🌼🍀🌼🌼🌼🥀\n🌼🌼🌼🌼🥀🥀'),(67,13,16,NULL,NULL,NULL,NULL,NULL,NULL,'🌲🗻🌲🌲🗻🏔\n🗻🏔🏔🌲🌲🌲\n🏔🗻🗻🌲🏔🌲'),(68,13,17,NULL,NULL,NULL,NULL,NULL,NULL,'🏔🏔🏔🌷🌷🏔\n🌷🏔🏔🏔🏔🏔\n🏔🏔🌷🌷🏔🏔'),(69,13,18,NULL,NULL,NULL,NULL,NULL,NULL,'🌾🗻🌱🌱🌾🗻\n🗻🗻🌾🗻🌱🗻\n🗻🌾🌱🌱🌾🌾'),(70,13,19,NULL,NULL,NULL,NULL,NULL,NULL,'🌋⛰⛰⛰🌳⛰\n🌳🌋🌳🌋⛰⛰\n🌳🌋⛰🌋🌋⛰'),(71,13,20,NULL,NULL,NULL,NULL,NULL,NULL,'🌾🌵🥀🌾🥀🥀\n🌵🌵🌾🌾🌵🥀\n🌵🥀🌾🌵🌵🌵'),(72,13,21,NULL,NULL,NULL,NULL,NULL,NULL,'🍀🌼🌼🌋🌼🌼\n🌋🍀🌼🌋🌋🍀\n🌋🌋🌼🍀🌼🌋'),(73,13,22,NULL,NULL,NULL,NULL,NULL,NULL,'⛰🌻🌻🌻⛰⛰\n🌻🌱⛰🌻🌻⛰\n🌻⛰🌻🌻⛰🌻'),(74,13,23,NULL,NULL,NULL,NULL,NULL,NULL,'⛰⛰⛰⛰🏔⛰\n⛰🏔⛰⛰⛰⛰\n⛰🏔🏔⛰⛰⛰');

  CREATE TABLE `map`(
  `x` INT,
  `y` INT,
  `val` INT
);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
