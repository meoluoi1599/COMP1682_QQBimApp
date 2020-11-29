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
-- Table structure for table `tblnotification`
--

DROP TABLE IF EXISTS `tblnotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblnotification` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `notification_content` varchar(400) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tblnotification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblnotification`
--

LOCK TABLES `tblnotification` WRITE;
/*!40000 ALTER TABLE `tblnotification` DISABLE KEYS */;
INSERT INTO `tblnotification` VALUES (28,'Add new story: One-way autumn',1),(29,'Add new story: Xuân',1),(30,'Add new story: Alone',11),(31,'Add new story: Trời mây',11),(32,'Add new story: Home',10),(33,'Add new story: Cake',10),(34,'Add new story: Shadowscafe tarot',10),(35,'Add new chapter of Home',10),(36,'Add new chapter of Xuân',1),(37,'Add new story: Autumn',11),(38,'Add new chapter of Cake',10),(39,'Add new chapter of One-way autumn',1),(40,'Add new story: In the road',1),(41,'Add new story: It is new road',1),(42,'Add new story: Hello',1),(43,'Add new story: Hello',1),(44,'Add new story: 123654',1),(45,'Add new story: ảnh',11),(46,'Add new story: Haha',1),(47,'Add new story: Thuyền',1);
/*!40000 ALTER TABLE `tblnotification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-29 23:07:41
