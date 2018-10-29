--
-- Author: Tyler Freitas
-- Title: DDQ file for Project 1
--

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;



--
-- Table structure for `membership`
--
DROP TABLE IF EXISTS `membership`;

CREATE TABLE `membership` (
    `membership_id` int(11) NOT NULL AUTO_INCREMENT,
    `bill` decimal(11, 2) NOT NULL DEFAULT 0,
    PRIMARY KEY(`membership_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;


--
-- Table structure for `family`;
--

DROP TABLE IF EXISTS `family`;

CREATE TABLE `family` (
    `family_id` int(11) NOT NULL AUTO_INCREMENT,
    `membership_id` int(11) NOT NULL,
    PRIMARY KEY(`family_id`),
    UNIQUE KEY(`membership_id`),
    CONSTRAINT `family_fk1`
    FOREIGN KEY(`membership_id`) REFERENCES `membership`(`membership_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;



--
-- Table structure for `person`
--

DROP TABLE IF EXISTS `person`;

CREATE TABLE `person` (
    `person_id` int(11) NOT NULL AUTO_INCREMENT,
    `street_name` varchar(255) NOT NULL,
    `zip_code` int(11) NOT NULL,
    `state` varchar(2) NOT NULL,
    `family_id` int(11) NOT NULL,
    `lname` varchar(255) NOT NULL,
    `fname` varchar(255) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    PRIMARY KEY(`person_id`),
    CONSTRAINT `person_fk1`
    FOREIGN KEY(`family_id`) REFERENCES `family`(`family_id`)
    ON DELETE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;


--
-- Table structure for `location`
--

DROP TABLE IF EXISTS `location`;

CREATE TABLE `location` (
    `location_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `capacity` int(4) NOT NULL,
    PRIMARY KEY(`location_id`)
) Engine=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;



--
-- Table structure for `service`
--

DROP TABLE IF EXISTS `service`;

CREATE TABLE `service` (
    `service_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `cost` decimal(11,2) NOT NULL DEFAULT 0,
    `location_id` int(11) NOT NULL,
    PRIMARY KEY(`service_id`),
    CONSTRAINT `service_fk1`
    FOREIGN KEY(`location_id`) REFERENCES `location`(`location_id`)
    ON DELETE CASCADE
) Engine=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for `person_service`
--

DROP TABLE IF EXISTS `person_service`;

CREATE TABLE `person_service` (
    `person_id` int(11) NOT NULL,
    `service_id` int(11) NOT NULL,
    PRIMARY KEY(`person_id`, `service_id`),
    CONSTRAINT `person_service_fk1`
    FOREIGN KEY(`person_id`) REFERENCES `person`(`person_id`)
    ON DELETE CASCADE,
    CONSTRAINT `person_service_fk2`
    FOREIGN KEY(`service_id`) REFERENCES `service`(`service_id`)
    ON DELETE CASCADE
) Engine=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

select * from family;
select * from membership;

--
-- populate tables
--

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=1 */;


--
-- Populate membership
--


INSERT INTO `membership` () VALUES
(),
(),
(),
();




--
-- Populate family
--


INSERT INTO `family` VALUES
(1, 28),
(2, 29);



--
-- Populate person
--


INSERT INTO `person` Values
(1, 'heather lane', '95105', 'CA', 1, 'smith', 'jon', '2017-10-12'),
(2, 'heather lane', '95105', 'CA', 1, 'smith', 'jane', '1991-11-1'),
(3, 'l street', '94224', 'CA', 2, 'jones', 'fred', '1954-3-4'),
(4, 'l street', '94224', 'CA', 2, 'jones', 'betty', '1984-12-3'),
(5, 'l street', '94224', 'CA', 2, 'jones', 'billy', '1999-3-4');





--
-- Populate location
--


INSERT INTO `location` VALUES
(1, 'weight room', 40),
(2, 'pool', 30),
(3, 'snack bar', 15);




--
-- Populate service
--


INSERT INTO `service` VALUES
(1, 'summer camp lunch', 50.00, 3),
(2, 'personal training', 100.00, 1),
(3, 'swim lessons', 75.00, 2);





--
-- Populate person_service
--


INSERT INTO `person_service` VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 3),
(4, 3);




UPDATE membership,

(SELECT family.family_id, membership.membership_id, person.fname, person.person_id, person_service.service_id, sum(service.cost) AS sumCost
FROM membership
	JOIN family
		ON family.membership_id = membership.membership_id
			JOIN person
				ON person.family_id = family.family_id
					JOIN person_service
						ON person.person_id = person_service.person_id
							JOIN service
								ON person_service.service_id = service.service_id
									GROUP BY family.family_id) t
SET membership.bill = t.sumCost
WHERE membership.membership_id = t.membership_id;
