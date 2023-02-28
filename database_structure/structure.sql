/* CREATE DATABASE tourism_agency;

USE tourism_agency

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    lastname VARCHAR(45) NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    password VARCHAR(45) NOT NULL,
    id_role INTEGER NOT NULL,
    FOREIGN KEY id_role REFERENCES role(id)
);

CREATE TABLE provinces (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
);

CREATE TABLE cities (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    id_province INTEGER NOT NULL,
    FOREIGN KEY id_province REFERENCES provinces(id)
);

CREATE TABLE students (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(45) NOT NULL,
    lastname VARCHAR(45) NOT NULL,
    document VARCHAR(11) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(12) NOT NULL,
    address VARCHAR(45) NOT NULL,
    city VARCHAR(45) NOT NULL,
    province VARCHAR(45) NOT NULL,
    postalcode VARCHAR(11) NOT NULL,
    info TEXT
);

CREATE TABLE tour_packages (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    description TEXT
); */

/* 
CREATE TABLE individual_contracts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nro_contract INT NOT NULL,
    indicated_date DATE NOT NULL,
    indicated_value DECIMAL(8,2) NOT NULL,
    payment_method VARCHAR(25) NOT NULL,
    id_user INT NOT NULL,
    id_student INT NOT NULL,
    id_general_contract INT NOT NULL,
    id_fee INT,
    id_state_individual_contract INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES students(id),
    FOREIGN KEY (id_student) REFERENCES students(id),
    FOREIGN KEY (id_general_contract) REFERENCES general_contracts(id),
    FOREIGN KEY (id_fee) REFERENCES fees(id),
    FOREIGN KEY (id_state_individual_contract) REFERENCES state_individual_contracts(id)
);

CREATE TABLE fees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    financing INT(2) NOT NULL,
    first_expired_date DATE NOT NULL,
    last_expired_date DATE,
    first_expired_value DECIMAL(8, 2) NOT NULL,
    last_expired_value DECIMAL(8, 2),
);

CREATE TABLE state_individual_contracts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    state TEXT NOT NULL
);

CREATE TABLE general_contracts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nro_contract INT NOT NULL,
    indicated_date DATE NOT NULL,
    indicated_value DECIMAL(11, 2) NOT NULL,
    travel_date DATE NOT NULL,
    id_tour_package INT NOT NULL,
    id_state_general_contract INT NOT NULL,
    id_individual_contract INT NOT NULL,
    id_responsible_general_contract INT NOT NULL,
    FOREIGN KEY id_tour_package REFERENCES tour_package(id),
    FOREIGN KEY id_state_general_contract REFERENCES state_general_contracts(id),
    FOREIGN KEY id_individual_contract REFERENCES individual_contracts(id),
    FOREIGN KEY id_responsible_general_contract REFERENCES responsible_general_contracts(id),
);

CREATE TABLE state_general_contracts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    state TEXT NOT NULL
);

CREATE TABLE tour_packages (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    description TEXT
);

CREATE TABLE responsible_general_contracts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_general_contracts INT NOT NULL,
    id_responsible_senior INT NOT NULL
);

CREATE TABLE responsible_senior (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(11) NOT NULL,
    firstname VARCHAR(45) NOT NULL,
    lastname VARCHAR(45) NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(12) NOT NULL,
    id_responsible_general_contract INT NOT NULL,
    FOREIGN KEY id_responsible_general_contract REFERENCES responsible_general_contracts(id)
); */