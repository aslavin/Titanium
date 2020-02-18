-- MySQL dump 10.13  Distrib 8.0.17, for macos10.14 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Games`
--

DROP TABLE IF EXISTS `Games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Games` (
  `game_id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `team1_id` int(11) NOT NULL,
  `team2_id` int(11) NOT NULL,
  `sub_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`game_id`),
  KEY `team1_id` (`team1_id`),
  KEY `team2_id` (`team2_id`),
  CONSTRAINT `Games_ibfk_1` FOREIGN KEY (`team1_id`) REFERENCES `teams` (`team_id`),
  CONSTRAINT `Games_ibfk_2` FOREIGN KEY (`team2_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Games`
--

LOCK TABLES `Games` WRITE;
/*!40000 ALTER TABLE `Games` DISABLE KEYS */;
INSERT INTO `Games` VALUES (1,'2020-03-01',1,2,'Rink 2'),(2,'2020-03-01',3,4,'Rink 1'),(3,'2020-03-08',1,3,'Rink 2'),(4,'2020-03-08',2,5,'Rink 1'),(5,'2020-03-15',1,4,'Rink 2'),(6,'2020-03-15',3,5,'Rink 1'),(7,'2020-03-22',1,5,'Rink 2'),(8,'2020-03-22',2,4,'Rink 1'),(9,'2020-03-29',2,3,'Rink 2'),(10,'2020-03-29',4,5,'Rink 1');
/*!40000 ALTER TABLE `Games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Leagues`
--

DROP TABLE IF EXISTS `Leagues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Leagues` (
  `league_id` int(11) NOT NULL AUTO_INCREMENT,
  `season` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `max_players_on_team` int(11) DEFAULT NULL,
  `max_teams_in_pool` int(11) NOT NULL,
  `max_pools_in_league` int(11) NOT NULL,
  `school_id` int(11) NOT NULL,
  `sport` varchar(255) NOT NULL,
  `level` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`league_id`),
  KEY `school_id` (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Leagues`
--

LOCK TABLES `Leagues` WRITE;
/*!40000 ALTER TABLE `Leagues` DISABLE KEYS */;
INSERT INTO `Leagues` VALUES (1,'Spring','2020-03-01 00:00:00','2020-04-27 00:00:00',20,5,10,1,'Broomball','CoRec Intramural','Compton Family Ice Arena'),(2,'Spring','2020-03-01 00:00:00','2020-04-27 00:00:00',20,5,5,1,'Basketball','Men\'s Interhall','JACC North Dome'),(3,'Spring','2020-03-01 00:00:00','2020-04-27 00:00:00',NULL,5,20,1,'Volleyball','Women\'s Interhall','Stepan Courts');
/*!40000 ALTER TABLE `Leagues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pools`
--

DROP TABLE IF EXISTS `Pools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pools` (
  `pool_id` int(11) NOT NULL AUTO_INCREMENT,
  `league_id` int(11) NOT NULL,
  `day` varchar(255) NOT NULL,
  `pool_time` datetime NOT NULL,
  PRIMARY KEY (`pool_id`),
  KEY `league_id` (`league_id`),
  CONSTRAINT `Pools_ibfk_1` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`league_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pools`
--

LOCK TABLES `Pools` WRITE;
/*!40000 ALTER TABLE `Pools` DISABLE KEYS */;
INSERT INTO `Pools` VALUES (1,1,'Wednesday','2020-02-13 18:00:00'),(2,1,'Wednesday','2020-02-13 19:00:00'),(3,1,'Thursday','2020-02-13 21:00:00'),(4,2,'Monday','2020-02-13 22:00:00'),(5,2,'Sunday','2020-02-13 14:00:00'),(6,2,'Sunday','2020-02-13 16:00:00'),(7,3,'Saturday','2020-02-13 15:30:00'),(8,3,'Sunday','2020-02-13 12:00:00'),(9,3,'Monday','2020-02-13 22:00:00');
/*!40000 ALTER TABLE `Pools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schools`
--

DROP TABLE IF EXISTS `Schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Schools` (
  `school_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` int(11) DEFAULT NULL,
  PRIMARY KEY (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schools`
--

LOCK TABLES `Schools` WRITE;
/*!40000 ALTER TABLE `Schools` DISABLE KEYS */;
INSERT INTO `Schools` VALUES (1,'University of Notre Dame','Notre Dame','IN',46556);
/*!40000 ALTER TABLE `Schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Team_Requests`
--

DROP TABLE IF EXISTS `Team_Requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Team_Requests` (
  `team_id` int(11) NOT NULL,
  `new_member_id` int(11) NOT NULL,
  `new_member_invited` int(11) NOT NULL,
  `new_member_accepted` int(11) NOT NULL,
  `moment_initiated` datetime DEFAULT NULL,
  PRIMARY KEY (`team_id`,`new_member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Team_Requests`
--

LOCK TABLES `Team_Requests` WRITE;
/*!40000 ALTER TABLE `Team_Requests` DISABLE KEYS */;
INSERT INTO `Team_Requests` VALUES (2,11,0,0,'2020-02-16 12:00:00'),(2,12,0,0,'2020-02-17 12:00:00'),(2,13,1,0,'2020-02-18 12:00:00'),(3,14,1,0,'2020-02-18 18:00:00'),(3,15,1,0,'2020-02-19 12:00:00');
/*!40000 ALTER TABLE `Team_Requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Teams`
--

DROP TABLE IF EXISTS `Teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Teams` (
  `team_id` int(11) NOT NULL AUTO_INCREMENT,
  `pool_id` int(11) NOT NULL,
  `capt_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `wins` int(11) NOT NULL,
  `losses` int(11) NOT NULL,
  `ties` int(11) NOT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teams`
--

LOCK TABLES `Teams` WRITE;
/*!40000 ALTER TABLE `Teams` DISABLE KEYS */;
INSERT INTO `Teams` VALUES (1,1,1,'Shamrocks',1,1,0),(2,1,2,'Leprechauns',0,2,0),(3,1,3,'Broom Roasted',1,1,0),(4,1,4,'Sk8ters',0,2,0),(5,1,16,'Broom Ballers',2,0,0),(6,2,6,'Irish',2,1,0),(7,2,7,'Siegfried Boys',0,2,0),(8,2,8,'Ice Climbers',3,0,0),(9,2,9,'Almost Varsity',1,2,0),(10,2,10,'Homies',0,3,0);
/*!40000 ALTER TABLE `Teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `pass_hash` varchar(255) DEFAULT NULL,
  `netid` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `is_undergrad` tinyint(1) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `residence_hall` varchar(255) DEFAULT NULL,
  `wins` int(11) DEFAULT NULL,
  `losses` int(11) DEFAULT NULL,
  `ties` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'aslavin@nd.edu','4e7c3729de2de9092d0b6115a60624debb3ca27d27b0a451a8265be35b70c481','aslavin','Andy','Slavin',1,0,'Male','Siegfried',1,7,0),(2,'tclare@nd.edu','2ff1ff0db802c09577f4d5ae27014265564fb6fbea94ac3e164e532539618588','tclare','Tommy','Clare',1,0,'Male','Knott',4,4,1),(3,'bhall7@nd.edu','52f2eb8e5ceacb32820f5682255bd9c31dd568fdc7f15b09172753d0b8dde20f','bhall7','Brian','Hall',1,0,'Male','O\'Neill',2,6,1),(4,'rcrisman@nd.edu','f1f100242c2efe983bd5e37f426e2bb57849e7b49a3382aa8cadf6fa2b2ae564','rcrisman','Rosie','Crisman',1,0,'Female','Welsh Family',2,3,0),(5,'ajudy@nd.edu','3691a5a771cd60a5c7d937b324e2be06402385fad5aa743b1949d52783fdf003','ajudy','Arianne','Judy',0,1,'Female',NULL,NULL,NULL,NULL),(6,'sminer@nd.edu','c67ac119e0b8d1f32d55381a8c8538871f3f41cc0e3ede32392c2bf12e5aacfb','sminer','Sebastian','Miner',1,0,'Male','Stanford',0,0,0),(7,'ccrahan2@nd.edu','7ce100c57c9535c04200ef9a37b4ace0a5f22733a0899386c9e47b542aa9acea','ccrahan2','Caiti','Crahan',1,0,'Female','Breen-Phillips',5,0,0),(8,'gjagoe@nd.edu','d268ced7985792fceccecabb832b2cf3559d1fac0616905dcb33c12244473408','gjagoe','Grace','Jagoe',1,0,'Female','Welsh Family',0,0,0),(9,'sgaitan@nd.edu','2747fa282a11edd75952eea9b768b068d34a6a128c5cea1ed33ab140c924ba16','sgaitan','Sabrina','Gaitan',1,0,'Female','McGlinn',0,0,0),(10,'gmodjesk@nd.edu','82111b69c171e2281227eeca05afe03e5d2fbd0b9b078db6ddfc65c033d4bd1d','gmodjesk','Griffin','Modjeski',1,0,'Male','O\'Neill',0,0,0),(11,'lrymsza@nd.edu','d89e80fdb9504f0782ab66c81b1982712fa6956519bbd0efcad6322ca2e97de5','lrymsza','Lauren','Rymsza',1,0,'Female','McGlinn',0,0,0),(12,'mkurkows@nd.edu','0a142c0e02353f2af35e6b895dde163e1255a91eaa186f5d2030963ae02e2146','mkurkows','Michael','Kurkowski',1,0,'Male','Knott',0,0,0),(13,'ascartz@nd.edu','dc14d12021568aaa15e0c510e37d02bb44dae8141445f3da5d605115a1762291','ascartz','Anna','Scartz',1,0,'Female','Cavanaugh',0,0,0),(14,'lharden@nd.edu','48928d1435e87a330133ab540d55945b0d97ced83387662c991c54f4785be54c','lharden','Leigh','Harden',1,0,'Female','Cavanaugh',0,0,0),(15,'scattana@nd.edu','0b4ff4c32f95c669f44735a77f27acc2d9e79ba19e011ec7651fb4986956b49e','scattana','Seth','Cattanach',1,0,'Male','St. Edward\'s',0,0,0),(16,'kgreif@nd.edu','83dced8239d8fe652c63f6bce00bd891466a7f549ce8cc9b441a2eb574c10c6a','kgreif','Kevin','Greif',1,0,'Male','Carroll',0,0,0),(17,'iweber@nd.edu','38ff82d56a26657bf8a4c3d1418796a0f17fe97ed59d829e90b5d6b6846ce1c7','iweber','Isabel','Weber',1,0,'Female\n','Pasquerilla East',0,0,0),(18,'jcozzi@nd.edu','18a9fe50a8d77e62c6ea76c1e1324fed934434e2beb666117c546e2070cb82ec','jcozzi','Joseph','Cozzi',1,0,'Male','Knott',0,0,0),(19,'pfische@nd.edu','03bb3a95c6b6928fefdafd7d5017be6f9fab5dacc0439e811fbe1791d525a2a6','pfische','Patrick','Fischer',1,0,'Male','Morrissey',0,0,0),(20,'cgillaspie@nd.edu','b1910fffb23b82c61f72e32634e501b89c14fdd3217e7b47a1bcd59e818304f7','cgillaspie','Collette','Gillaspie',1,0,'Female','Welsh Family',0,0,0);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users_Teams`
--

DROP TABLE IF EXISTS `Users_Teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_Teams` (
  `user_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`team_id`),
  KEY `team_id` (`team_id`),
  KEY `idx_users_teams` (`user_id`,`team_id`),
  CONSTRAINT `Users_Teams_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `Users_Teams_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users_Teams`
--

LOCK TABLES `Users_Teams` WRITE;
/*!40000 ALTER TABLE `Users_Teams` DISABLE KEYS */;
INSERT INTO `Users_Teams` VALUES (1,1),(2,2),(3,3),(4,4),(16,5),(6,6),(7,7),(8,8),(9,9),(10,10);
/*!40000 ALTER TABLE `Users_Teams` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-17 21:50:56
