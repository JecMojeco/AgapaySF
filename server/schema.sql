-- AgapaySF Database Schema

-- ENUMs
CREATE TYPE user_role AS ENUM ('Kagawad', 'Staff', 'Admin');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');
CREATE TYPE disaster_type AS ENUM ('Flood', 'Typhoon', 'Fire', 'Earthquake', 'Landslide');
CREATE TYPE gender_enum AS ENUM ('M', 'F');
CREATE TYPE structure_type_enum AS ENUM ('Residential', 'Commercial', 'Agricultural', 'Industrial');
CREATE TYPE damage_level_enum AS ENUM ('Partial', 'Total');
CREATE TYPE evacuation_status AS ENUM ('Evacuated', 'Returned', 'Transferred');

CREATE TABLE "USER" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    contact_number CHAR(11) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status user_status NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE DISASTER_EVENT (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    date_started DATE NOT NULL,
    date_ended DATE,
    disaster_type disaster_type NOT NULL
);

CREATE TABLE BARANGAY_ZONE (
    zone_id SERIAL PRIMARY KEY,
    zone_name VARCHAR(30) NOT NULL,
    assigned_kagawad INTEGER NOT NULL REFERENCES "USER"(user_id)
);

CREATE TABLE RESIDENT (
    resident_id SERIAL PRIMARY KEY,
    surname VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    middle_initial CHAR(1),
    gender gender_enum NOT NULL,
    birth_date DATE NOT NULL,
    contact_number CHAR(11),
    family_size INTEGER NOT NULL CHECK (family_size >= 1),
    senior_citizen_count INTEGER NOT NULL DEFAULT 0,
    fourPs_member_count INTEGER NOT NULL DEFAULT 0,
    baby_count INTEGER NOT NULL DEFAULT 0,
    infant_count INTEGER NOT NULL DEFAULT 0,
    pregnant_count INTEGER NOT NULL DEFAULT 0,
    pwd_count INTEGER NOT NULL DEFAULT 0,
    zone_id INTEGER NOT NULL REFERENCES BARANGAY_ZONE(zone_id)
);

CREATE TABLE STRUCTURE (
    structure_id SERIAL PRIMARY KEY,
    address VARCHAR(150) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES RESIDENT(resident_id),
    structure_type structure_type_enum NOT NULL
);

CREATE TABLE ASSESSMENT_REPORT (
    report_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "USER"(user_id),
    event_id INTEGER NOT NULL REFERENCES DISASTER_EVENT(event_id),
    structure_id INTEGER NOT NULL REFERENCES STRUCTURE(structure_id),
    damage_level damage_level_enum NOT NULL,
    photo_url VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EVACUATION_LOG (
    evacuation_id SERIAL PRIMARY KEY,
    resident_id INTEGER NOT NULL REFERENCES RESIDENT(resident_id),
    event_id INTEGER NOT NULL REFERENCES DISASTER_EVENT(event_id),
    arrival_date DATE NOT NULL,
    departure_date DATE,
    status evacuation_status NOT NULL DEFAULT 'Evacuated'
);
