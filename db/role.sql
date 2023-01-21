INSERT INTO role (title, salary, department_id)
VALUES("General Merch", 25000, (SELECT dep_id FROM department where department_name="General Merch"))