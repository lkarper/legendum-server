BEGIN;

TRUNCATE
    legendum_users
    RESTART IDENTITY CASCADE;

INSERT INTO legendum_users (user_name, password, display_name, admin)
    VALUES 
    ('hanbran', '$2a$12$UtE7sMr3odc6aIBZdi36.O9Nm2mv7ohZ1IF.bo.MghA2ktqW75TM6', 'Lu', true),
    ('hanbranNoAuth', '$2a$12$UtE7sMr3odc6aIBZdi36.O9Nm2mv7ohZ1IF.bo.MghA2ktqW75TM6', 'Lu', false);

COMMIT;
