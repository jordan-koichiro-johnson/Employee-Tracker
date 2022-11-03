INSERT INTO departments (name)
VALUES ("hr"),
       ("customer service");

INSERT INTO roles (title, salary, department_id)
VALUES ("fighter", "40000", 1),
        ("dude", "60000", 2),
        ("manager", "90000", 2),
        ("manager", "80000", 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("manager", "dude", 3, null),
        ("other", "manager", 4, null),
        ("some", "guy", 2, 1),
        ("other", "guy", 1, 2);