--Add Tony Stark account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starknet.com',
        'Iam1ronm@n'
    );
--Modify the Tony Stark record to change the account_type to "Admin".
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';
--Delete the Tony Stark record from the database.
DELETE FROM account
WHERE account_firstname = 'Tony';
--Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors"
UPDATE public.inventory
SET inv_description = REPLACE (
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM';
--Use an inner join to select the make and model fields from the inventory table and the classification 
-- name field from the classification table for inventory items that belong to the "Sport" category.
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory
    JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';
--Update all records in the inventory table to add "/vehicles" 
-- to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');