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
-- Table structure for table `tbluser`
--

DROP TABLE IF EXISTS `tbluser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbluser` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_pw` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fullname` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_avatar` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `user_email` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `num_following` int(11) DEFAULT NULL,
  `num_follower` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

LOCK TABLES `tbluser` WRITE;
/*!40000 ALTER TABLE `tbluser` DISABLE KEYS */;
INSERT INTO `tbluser` VALUES (1,'bimconuong','$2b$12$mLwFCzmWiuRu83/W4kQNZe/G0sQLGXZTgLg63Q.dDiZ/yrdzKq35a','Đinh Thị Bim','http://192.168.0.101:19000/return_img/acount9.jpg','quyendt1599@gmail.com',1,1),(2,'hoahoa123','$2b$12$l2y1w7K3ouKwLnWqPzc1Ee.LZAwIF4EBAtN.kqps2HgPpRnt2Ed1i','Hà Thiên Cầm','http://192.168.0.101:19000/return_img/acount10.jpg','hoahoa123@gmail.com',0,0),(3,'dinhbim123','$2b$12$dvU8Uzx52bWyXYAcKT1Rn.jfHm2HWixh0ZqO1Yp.i3ZMdwpvMoUea','Marry Nicolas','http://192.168.0.101:19000/return_img/acount2.jpg','dinhbim123@gmail.com',0,2),(4,'bim123','$2b$12$zujhwl.XWbKoONLOQ/FLT.aAM0yoolHNJe29PXkMfZMQmk0SmrtVq','James ','http://192.168.0.101:19000/return_img/acount3.jpg','bim123@gmail.com',0,0),(5,'lulualone','$2b$12$XmJwRHBRoJ4HLSIg83YMT.HEBz8DgRry0RNoo0RapuplESRzdygYq','Sử Mạc Nhiên','http://192.168.0.101:19000/return_img/acount4.jpg','lulu123@gmail.com',0,0),(6,'alone123','$2b$12$o/egIaT37YHAyhyFEfOiCeai61xEqCcV/OdW.EZZEHJ9rPgyQnuSO','Jonathon Mac','http://192.168.0.101:19000/return_img/Quyên.jpg','tutu123@gmail.com',0,0),(7,'jonhdoe','$2b$12$8oLQLrlE/NyYsROY.7zokudl3gymQpYYFWGzWw./3WA38uJJvyFnG','Jonh Doe','http://192.168.0.101:19000/return_img/acount6.jpg','jonhdoe@gmail.com',0,0),(8,'gaquay','$2b$12$CiY1XkkceLjUd90SYIP1.OJT52Qfi5rClbpOLOmdE8VtWA6kgBLE.','Kim Huyền Diễm','http://192.168.0.101:19000/return_img/acount7.jpg','gaquay@gmail.com',0,0),(9,'ngokngok','$2b$12$PYWAWU2KFgbZAcSFIya./.GdthwF3WjBdTKXR3hwb/yH.86Z1bDce','Lâm Mac Nghi','http://192.168.0.101:19000/return_img/acount8.jpg','ngokngok@gmail.com',0,0),(10,'love1509','$2b$12$bb1cpxaLWSzy8I4YqhfPDOLQFQh/KgePMEjzWtEdio7YkxURSdNd6','Lương Gia Lương','http://192.168.0.101:19000/return_img/Ggyyy83046ce9321875e2.jpg','dinhthiquyen15.2.1999@gmail.com',0,1),(11,'quyen123','$2b$12$FFvYWj182Xav2z4Ktx/8wu6vhbGKqNm.pHGXmOMLDrpBdod0J5X3m','Đinh Thị Quyên','http://192.168.0.101:19000/return_img/quyen123445ef2bfbec75197.jpg','quyendtgbh17114@fpt.edu.vn',1,0);
/*!40000 ALTER TABLE `tbluser` ENABLE KEYS */;
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
