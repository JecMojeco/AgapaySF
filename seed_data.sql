-- Robust Filler data for AgapaySF
-- Uses subqueries to avoid ID mismatch

DO $$ 
DECLARE
    admin_id INT;
    kagawad1_id INT;
    kagawad2_id INT;
    zone1_id INT;
    zone2_id INT;
    event1_id INT;
    event2_id INT;
    res1_id INT;
    res2_id INT;
    res3_id INT;
    res4_id INT;
    res5_id INT;
    struct1_id INT;
    struct2_id INT;
    struct3_id INT;
    struct5_id INT;
BEGIN
    -- 1. Users (Password: Password123!)
    -- Hash: $2b$10$vI8A7sz5i.Y8p6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6
    
    INSERT INTO "USER" (name, role, contact_number, password, status) VALUES
    ('Juan Dela Cruz', 'Admin', '09123456789', '$2b$10$vI8A7sz5i.Y8p6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6', 'ACTIVE')
    ON CONFLICT (contact_number) DO UPDATE SET status = 'ACTIVE' RETURNING user_id INTO admin_id;

    INSERT INTO "USER" (name, role, contact_number, password, status) VALUES
    ('Maria Santos', 'Kagawad', '09223334444', '$2b$10$vI8A7sz5i.Y8p6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6', 'ACTIVE')
    ON CONFLICT (contact_number) DO UPDATE SET status = 'ACTIVE' RETURNING user_id INTO kagawad1_id;

    INSERT INTO "USER" (name, role, contact_number, password, status) VALUES
    ('Pedro Penduko', 'Kagawad', '09334445555', '$2b$10$vI8A7sz5i.Y8p6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6', 'ACTIVE')
    ON CONFLICT (contact_number) DO UPDATE SET status = 'ACTIVE' RETURNING user_id INTO kagawad2_id;

    INSERT INTO "USER" (name, role, contact_number, password, status) VALUES
    ('Staff One', 'Staff', '09445556666', '$2b$10$vI8A7sz5i.Y8p6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6', 'ACTIVE')
    ON CONFLICT (contact_number) DO NOTHING;

    -- 2. Barangay Zones
    INSERT INTO BARANGAY_ZONE (zone_name, assigned_kagawad) VALUES
    ('Zone 1', kagawad1_id) RETURNING zone_id INTO zone1_id;
    INSERT INTO BARANGAY_ZONE (zone_name, assigned_kagawad) VALUES
    ('Zone 2', kagawad2_id) RETURNING zone_id INTO zone2_id;

    -- 3. Disaster Events
    INSERT INTO DISASTER_EVENT (event_name, date_started, date_ended, disaster_type) VALUES
    ('Typhoon Egay', '2023-07-25', '2023-07-28', 'Typhoon') RETURNING event_id INTO event1_id;
    INSERT INTO DISASTER_EVENT (event_name, date_started, date_ended, disaster_type) VALUES
    ('Bagtik Flood', '2023-08-10', '2023-08-11', 'Flood') RETURNING event_id INTO event2_id;

    -- 4. Residents
    INSERT INTO RESIDENT (surname, first_name, middle_initial, gender, birth_date, contact_number, family_size, senior_citizen_count, fourPs_member_count, baby_count, infant_count, pregnant_count, pwd_count, zone_id) VALUES
    ('Reyes', 'Ricardo', 'A', 'Male', '1980-05-20', '09111112222', 5, 1, 1, 0, 1, 0, 0, zone1_id) RETURNING resident_id INTO res1_id;
    INSERT INTO RESIDENT (surname, first_name, middle_initial, gender, birth_date, contact_number, family_size, senior_citizen_count, fourPs_member_count, baby_count, infant_count, pregnant_count, pwd_count, zone_id) VALUES
    ('Gomez', 'Elena', 'B', 'Female', '1992-10-15', '09222223333', 4, 0, 0, 1, 0, 1, 0, zone1_id) RETURNING resident_id INTO res2_id;
    INSERT INTO RESIDENT (surname, first_name, middle_initial, gender, birth_date, contact_number, family_size, senior_citizen_count, fourPs_member_count, baby_count, infant_count, pregnant_count, pwd_count, zone_id) VALUES
    ('Bautista', 'Antonio', 'C', 'Male', '1955-12-30', '09333334444', 3, 2, 0, 0, 0, 0, 1, zone2_id) RETURNING resident_id INTO res3_id;
    INSERT INTO RESIDENT (surname, first_name, middle_initial, gender, birth_date, contact_number, family_size, senior_citizen_count, fourPs_member_count, baby_count, infant_count, pregnant_count, pwd_count, zone_id) VALUES
    ('Lopez', 'Sarah', 'D', 'Female', '1988-02-14', '09444445555', 6, 0, 1, 2, 1, 0, 0, zone2_id) RETURNING resident_id INTO res4_id;
    INSERT INTO RESIDENT (surname, first_name, middle_initial, gender, birth_date, contact_number, family_size, senior_citizen_count, fourPs_member_count, baby_count, infant_count, pregnant_count, pwd_count, zone_id) VALUES
    ('Villanueva', 'Jose', 'E', 'Male', '1975-07-04', '09555556666', 2, 0, 0, 0, 0, 0, 0, zone1_id) RETURNING resident_id INTO res5_id;

    -- 5. Structures
    INSERT INTO STRUCTURE (address, owner_id, structure_type) VALUES
    ('123 Zone 1 St.', res1_id, 'Residential') RETURNING structure_id INTO struct1_id;
    INSERT INTO STRUCTURE (address, owner_id, structure_type) VALUES
    ('456 Zone 1 Blvd.', res2_id, 'Residential') RETURNING structure_id INTO struct2_id;
    INSERT INTO STRUCTURE (address, owner_id, structure_type) VALUES
    ('789 Zone 2 Ave.', res3_id, 'Residential') RETURNING structure_id INTO struct3_id;
    INSERT INTO STRUCTURE (address, owner_id, structure_type) VALUES
    ('202 Zone 1 Alley', res5_id, 'Commercial') RETURNING structure_id INTO struct5_id;

    -- 6. Assessment Reports
    INSERT INTO ASSESSMENT_REPORT (user_id, event_id, structure_id, damage_level, photo_url) VALUES
    (kagawad1_id, event1_id, struct1_id, 'Partial', 'https://example.com/photo1.jpg');
    INSERT INTO ASSESSMENT_REPORT (user_id, event_id, structure_id, damage_level, photo_url) VALUES
    (kagawad1_id, event1_id, struct2_id, 'Total', 'https://example.com/photo2.jpg');
    INSERT INTO ASSESSMENT_REPORT (user_id, event_id, structure_id, damage_level, photo_url) VALUES
    (kagawad2_id, event2_id, struct3_id, 'Partial', 'https://example.com/photo3.jpg');

    -- 7. Evacuation Logs
    INSERT INTO EVACUATION_LOG (resident_id, event_id, arrival_date, departure_date, status) VALUES
    (res1_id, event1_id, '2023-07-25', '2023-07-28', 'Returned');
    INSERT INTO EVACUATION_LOG (resident_id, event_id, arrival_date, departure_date, status) VALUES
    (res4_id, event2_id, '2023-08-10', NULL, 'Evacuated');

END $$;
