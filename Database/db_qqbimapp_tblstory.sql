-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: db_qqbimapp
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblstory`
--

DROP TABLE IF EXISTS `tblstory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblstory` (
  `story_id` int(11) NOT NULL AUTO_INCREMENT,
  `story_title` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `story_description` text,
  `story_img` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `vote` int(11) DEFAULT NULL,
  `parts` int(11) DEFAULT NULL,
  `story_status` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`story_id`),
  UNIQUE KEY `story_id` (`story_id`),
  KEY `fk_author_id` (`author_id`),
  KEY `fk_category_id` (`category_id`),
  CONSTRAINT `fk_author_id` FOREIGN KEY (`author_id`) REFERENCES `tbluser` (`user_id`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `tblcategory` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstory`
--

LOCK TABLES `tblstory` WRITE;
/*!40000 ALTER TABLE `tblstory` DISABLE KEYS */;
INSERT INTO `tblstory` VALUES (1,'One-way autumn',1,'Autumn, also known as fall in North American English,[1] is one of the four temperate seasons. Outside the tropics, autumn marks the transition from summer to winter, in September (Northern Hemisphere) or March (Southern Hemisphere), when the duration of daylight becomes noticeably shorter and the temperature cools considerably.','http://192.168.0.101:19000/return_img/Một chiều thu54638343bec3b9c1.jpg',5,0,1,'On Writing'),(2,'Xuân',1,'Mùa chuyển tiếp từ đông sang hạ, thời tiết ấm dần lên, thường được coi là mở đầu của năm. Mùa xuân, trăm hoa đua nở. Vui Tết đón xuân. Năm, dùng để tính thời gian đã trôi qua, hay tuổi con người. Đã mấy xuân qua. Mới hai mươi xuân.','http://192.168.0.101:19000/return_img/Xuânf96724e8b014b9ab.jpg',5,1,1,'On Writing'),(3,'Alone',11,'Hzhxh','http://192.168.0.101:19000/return_img/Bsbsd14d04c6641993fe.jpg',7,0,0,'On Writing'),(4,'Trời mây',11,'Jfjfj','http://192.168.0.101:19000/return_img/Nfndn9c825de73e8d062a.jpg',1,0,0,'On Writing'),(5,'Home',10,'Another summer day, Has come and gone away In Paris and Rome But I wanna go home, mmm','http://192.168.0.101:19000/return_img/Home723dcea817e10fa6.jpg',6,0,1,'Drop'),(6,'Cake',10,'Cake an item of soft, sweet food made from a mixture of flour, shortening, eggs, sugar, and other ingredients, baked and often decorated.','http://192.168.0.101:19000/return_img/Cake260bbdffcd1a9407.jpg',7,0,1,'On Writing'),(7,'Shadowscafe tarot',10,'Surrender to the fantastical world of your deepest dreams...where butterflies float upon shifting mists set aglow by the rising sun. A place where twisting branches arc across shimmering skies, willowy fairies dance on air, and tree spirits sing from a hallowed oak.','http://192.168.0.101:19000/return_img/shadowscafe_tarot.jpg',7,0,0,'On Writing'),(38,'Autumn',11,'This is my story.','http://192.168.0.101:19000/return_img/Autumn55fe7d734213463b.jpg',6,0,0,'On Writing'),(39,'In the road',1,'In the trip.','http://192.168.0.101:19000/return_img/acount3.jpg',2,0,0,'On Writing'),(46,'Thuyền',1,'Khơi','http://192.168.0.101:19000/return_img/Thuyềnbb95591ea8e9c39f.jpg',1,0,0,'On Writing');
/*!40000 ALTER TABLE `tblstory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-29 23:07:39
