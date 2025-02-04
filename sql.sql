DROP DATABASE SocraCare;
CREATE DATABASE IF NOT EXISTS SocraCare;
USE SocraCare;

CREATE TABLE IF NOT EXISTS hospital (
  hospital_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  address VARCHAR(250) NOT NULL,
  city VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  description VARCHAR(250),
  image VARCHAR(100),
  is_deleted BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS speciality (
  speciality_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
  name VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS doctor (
  doctor_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
  hospital_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  speciality_id INT NOT NULL,
  description VARCHAR(200),
  image VARCHAR(100),
  is_deleted BOOLEAN NOT NULL DEFAULT 0,
  CONSTRAINT fk_Doctor_Hospital
    FOREIGN KEY (hospital_id)
    REFERENCES hospital (hospital_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_Doctor_Speciality1
    FOREIGN KEY (speciality_id)
    REFERENCES speciality (speciality_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- VIEWS
CREATE VIEW active_hospitals AS
SELECT hospital_id, name, email, password, address, city, phone_number, description, image
FROM hospital 
WHERE is_deleted = 0;

CREATE VIEW active_doctors AS
SELECT 
    d.doctor_id,
    d.hospital_id,
    d.name,
    d.last_name,
    d.degree,
    s.name AS speciality,
    d.description,
    d.image
FROM doctor d
JOIN speciality s ON d.speciality_id = s.speciality_id
WHERE d.is_deleted = 0;

SELECT * FROM active_doctors WHERE hospital_id = 1;

-- INSERTS
INSERT INTO speciality (name) 
VALUES ('Cardiología'), ('Dermatología'), ('Neurología'), ('Pediatría'), ('Ortopedia'), ('Ginecología'), ('Oftalmología'), 
	('Oncología'), ('Traumatología'), ('Medicina Interna');
    
SELECT * FROM speciality;
    
INSERT INTO hospital (name, email, password, address, city, phone_number, description, image) 
VALUES 
('Hospital Gregorio Marañón', 'info@hospitalgregorio.com', '$2b$10$VKWRUcUadsmQ8XSlEcbFsu0G9Yiy3j7RScMYH9tCrUKfDGKmnn/Bm', 'Calle del Dr. Esquerdo, 46', 'Madrid', '917220400', 'Hospital Gregorio Marañón, centro hospitalario de referencia en España', 'hospital_gregorio.jpg'),
('Hospital Clínic de Barcelona', 'contacto@clinicabarcelona.com', '$2b$10$VKWRUcUadsmQ8XSlEcbFsu0G9Yiy3j7RScMYH9tCrUKfDGKmnn/Bm', 'Carrer de Pau Claris, 167', 'Barcelona', '932027900', 'Hospital Clínic de Barcelona, líder en atención médica', 'hospital_clinic.jpg'),
('Hospital Universitario La Paz', 'atencion@hospitaluniversitario.com', '$2b$10$VKWRUcUadsmQ8XSlEcbFsu0G9Yiy3j7RScMYH9tCrUKfDGKmnn/Bm', 'Calle de la Princesa, 1', 'Madrid', '915860000', 'Hospital Universitario La Paz, especializado en investigación médica', 'hospital_lapaz.jpg'),
("Hospital Universitari Vall d\'Hebron", 'informacion@hospitaluniversitari.com', '$2b$10$VKWRUcUadsmQ8XSlEcbFsu0G9Yiy3j7RScMYH9tCrUKfDGKmnn/Bm', 'Avinguda de Vallcarca, 151', 'Barcelona', '932704000', 'Hospital Universitari Vall d\'Hebron, especializado en enfermedades complejas', 'hospital_vallhebron.jpg'),
('Hospital Sanitas CIMA', 'contacto@hospitalsanitas.com', '$2b$10$VKWRUcUadsmQ8XSlEcbFsu0G9Yiy3j7RScMYH9tCrUKfDGKmnn/Bm', 'Carrer de Pau Claris, 81', 'Barcelona', '934149200', 'Hospital Sanitas CIMA, reconocido por su tecnología de vanguardia', 'hospital_sanitas.jpg');

SELECT * FROM hospital;

INSERT INTO doctor (hospital_id, name, last_name, degree, speciality_id, description, image) 
VALUES 
(1, 'Carlos', 'Martínez', 'Cardiólogo', 1, 'Especialista en enfermedades cardiovasculares', 'carlos_martinez.jpg'),
(1, 'Isabel', 'López', 'Dermatóloga', 2, 'Experta en tratamientos dermatológicos avanzados', 'isabel_lopez.jpg'),
(1, 'Pedro', 'González', 'Neurología', 3, 'Médico especializado en trastornos neurológicos', 'pedro_gonzalez.jpg'),
(2, 'María', 'Rodríguez', 'Pediatra', 4, 'Médico pediatra con más de 10 años de experiencia', 'maria_rodriguez.jpg'),
(2, 'Antonio', 'Fernández', 'Oftalmólogo', 7, 'Especialista en enfermedades oculares y cirugía láser', 'antonio_fernandez.jpg'),
(3, 'Laura', 'Martín', 'Oncóloga', 8, 'Especialista en tratamientos oncológicos avanzados', 'laura_martin.jpg'),
(4, 'Javier', 'Hernández', 'Ortopedista', 5, 'Experto en cirugía ortopédica y traumatología', 'javier_hernandez.jpg');

SELECT * FROM doctor;