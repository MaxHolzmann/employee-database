INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Joseph", "Joestar", (SELECT id FROM role where title="General Merch"))