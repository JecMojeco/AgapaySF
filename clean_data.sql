-- Script to clear all data and reset sequences
-- WARNING: This will delete ALL records from the database.

TRUNCATE 
    EVACUATION_LOG,
    ASSESSMENT_REPORT,
    STRUCTURE,
    RESIDENT,
    BARANGAY_ZONE,
    DISASTER_EVENT,
    "USER"
RESTART IDENTITY CASCADE;
