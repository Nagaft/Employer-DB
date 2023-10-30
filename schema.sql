
CREATE DATABASE IF NOT EXISTS EmployeeDB;

USE EmployeeDB;


DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Employees;

CREATE TABLE Departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(id)
);

CREATE TABLE Employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role_id INT,
    manager_id INT,
    is_manager BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES Roles(id),
    FOREIGN KEY (manager_id) REFERENCES Employees(id)
);
