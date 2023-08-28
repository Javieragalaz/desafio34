CREATE TABLE usuarios (
    id SERIAL, 
    email VARCHAR (50) NOT NULL,
    password VARCHAR (500) NOT NULL,
    rol VARCHAR (25), 
    lenguage VARCHAR(20));