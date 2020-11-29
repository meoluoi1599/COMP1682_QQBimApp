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
-- Table structure for table `tblreport`
--

DROP TABLE IF EXISTS `tblreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblreport` (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `report_title` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `report_content` text,
  `story_id` int(11) DEFAULT NULL,
  `reporter` int(11) DEFAULT NULL,
  `report_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `story_id` (`story_id`),
  KEY `reporter` (`reporter`),
  CONSTRAINT `tblreport_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `tblstory` (`story_id`),
  CONSTRAINT `tblreport_ibfk_2` FOREIGN KEY (`reporter`) REFERENCES `tbluser` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreport`
--

LOCK TABLES `tblreport` WRITE;
/*!40000 ALTER TABLE `tblreport` DISABLE KEYS */;
INSERT INTO `tblreport` VALUES (11,'Copy my story','In this story, she copy my idea and copy all of my chapter for her story.',1,11,'Wait'),(12,'There are bad content','In this story there are bad content. It teaches about cook a bad cake which can affeact bad for the heathy.',6,11,'Wait'),(13,'Wrong content','This is bad story. It copy the content.',7,11,'Done');
/*!40000 ALTER TABLE `tblreport` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-29 23:07:38
