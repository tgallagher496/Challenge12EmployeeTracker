USE employee_db;

INSERT INTO department(name)
VALUES("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role(title,salary,department_id)
VALUES("Sales Lead", 100000,1),
    ("Software Engineer", 120000,2),
    ("Salesperson",80000,1),
    ("Lead Engineer", 150000,2),
    ("Account Manager", 160000,3),
    ("Accountant", 125000,3),
    ("Legal Team Lead", 250000,4),
    ("Lawyer", 190000,4);

INSERT INTO employee(first_name,last_name,role_id)
VALUES("John","Doe", 1),
        ("Mike", "Chan",3),
        ("Ashely","Rodriguez",4),
        ("Kevin","Tupik",2),
        ("Kunal","Singh", 5),
        ("Malia","Brown",6),
        ("Sarah","Lourd",7),
        ("Tom","Allen",8);

UPDATE employee SET manager_id=2 WHERE id=1;
UPDATE employee SET manager_id=4 WHERE id=3;
UPDATE employee SET manager_id=6 WHERE id=5;
UPDATE employee SET manager_id=8 WHERE id=7;