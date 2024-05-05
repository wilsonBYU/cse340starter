-- Insert records
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tonny',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );
-- Update records
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tonny'
  AND account_lastname = 'Stark';
-- Delete records
DELETE FROM account
WHERE account_firstname = 'Tonny'
  AND account_lastname = 'Stark';
-----------------------------------
-- Update the GM Hummer description
-----------------------------------
UPDATE inventory
SET inv_description = REPLACE(
    inv_description,
    'small interiors',
    'a huge interior'
  )
WHERE inv_make = 'GM'
  and inv_model = 'Hummer';
----------------------------------------------
-- Make and model of the "sport" category cars
----------------------------------------------
SELECT inv_make,
  inv_model
FROM inventory i
  JOIN classification c ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';
--------------------------------------------------------
-- Update all records file path for image and thumbnails
--------------------------------------------------------
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');