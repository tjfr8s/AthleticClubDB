--
-- Adding and Deleteing Entities
--

-- Add a new family with the supplied membership id.
INSERT INTO `family` (`membership_id`)
VALUES (:membership_id);

-- Delete the family associated with the supplied family ID. This will
-- cascade on delete.
DELETE FROM `family`
WHERE `family_id` = :family_id;

-- Add a new location with the supplied values.
INSERT INTO `location` (`name`, `capacity`)
VALUES (:name, :capacity);

-- Delete the location corresponding to the supplied ID
DELETE FROM `location`
WHERE `location_id` = :location_id;

-- Add a new membership.
INSERT INTO `membership`()
VALUES ();

-- Delete the specified membership.
DELETE FROM `membership`
WHERE `membership_id`=membership_id;

-- Add a new person.
INSERT INTO `person` (`street_name`, `zip_code`, `state`, `family_id`, `fname`,
     `lname`, `date_of_birth`)
VALUES (:street_name, :zip_code, :state, :family_id, :fname, :lname, DATE :date_of_birth);

-- Delete the specified person.
DELETE FROM `person`
WHERE `person_id` = :person_id;

-- Add a new service.
INSERT INTO `service` (`name`, `cost`, `location_id`)
VALUES (:name, :cost, :location_id);

-- Delete the specified service.
DELETE FROM `service`
WHERE `service_id` = :service_id;

--
-- Displaying Information About Entities
--

-- Display Family Information For add_delete_families.html
SELECT f.family_id, COUNT(p.person_id), f.membership_id, m.bill FROM family f
INNER JOIN person p ON f.family_id = p.family_id
INNER JOIN membership m ON f.membership_id = m.membership_id
GROUP BY f.family_id;

-- Display Location Information For add_delete_location.html
SELECT `location_id`, `name`, `capacity` FROM location;

-- Display Information For add_delete_memberships.html
SELECT m.membership_id, COUNT(p.person_id), m.bill FROM membership m
LEFT JOIN family f ON m.membership_id = f.membership_id
LEFT JOIN person p ON f.family_id = p.family_id
GROUP BY m.membership_id;

-- Display Information For add_delete_people.html
SELECT person_id, lname, fname, family_id, date_of_birth, zip_code, state, street_name
FROM person;

-- Display Information For add_delete_service.html
SELECT s.service_id, s.name, s.cost, l.location_id, l.name FROM service s
LEFT JOIN location l ON s.location_id = l.location_id;

-- Display Information For manage_family_membership.html
SELECT m.membership_id, f.family_id FROM membership m
LEFT JOIN family f ON m.membership_id = f.membership_id;

-- Display Information For manage_person_family.html
SELECT f.family_id, p.person_id, p.fname, p.lname FROM family f
LEFT JOIN person p ON f.family_id = p.family_id;

-- Display Information For manage_person_service.html
SELECT p.person_id, p.fname, p.lname, s.service_id, s.name, s.cost FROM person p
INNER JOIN person_service ps ON p.person_id = ps.person_id
INNER JOIN service s ON s.service_id = ps.service_id;

-- Display Information For manage_service_location.html
SELECT s.service_id, s.name, l.location_id, l.name FROM service s
LEFT JOIN location l ON s.location_id = l.location_id;

-- Populate New Service Location Drop Down
SELECT name, location_id FROM location;

-- Populate Service Drop Down for person_service
SELECT service_id, name FROM service;

-- Populate Person Drop Down for person_service
SELECT person_id, fname, lname FROM person;

-- Populate Family Drop Down for New Person Form
SELECT family_id FROM family

-- Populate Membership Drop Down for New Family Form
SELECT membership_id FROM membership WHERE membership_id NOT IN
(SELECT membership_id FROM family)"


--
-- Modifying Relationships
--

-- Modify a family's membership_id
UPDATE `family`
SET `membership_id` = :membership_id
WHERE `family_id` = :family_id;

-- Modify a person's family
UPDATE `person`
SET `family_id` = :family_id
WHERE `person_id` = :person_id;

-- Modify a service's locaiton
UPDATE `service`
SET `location_id` = :location_id
WHERE `service_id` = :location_id;

-- Manage a person's services
INSERT INTO `person_service` (`person_id`, `service_id`)
VALUES (:person_id, :service_id);

DELETE FROM `person_service`
WHERE `person_id` = :person_id AND `service_id` = :service_id;
