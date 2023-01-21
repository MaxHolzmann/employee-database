require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


/* 
TODO:
add manager to employee
*/

//mysql database connection
const db = mysql.createConnection({
        host: 'localhost',
       user: process.env.DBUSER,
       password: process.env.DBPASS,
       database: 'business_db'
});

//questions for initial prompt
const questions = [{
    name: "select",
    message: "Select an option!",
    type: "list",
    choices: ["View All Departments",
                "View All Roles",
                "View All Employees",
                "Add A Department",
                "Add A Role",
                "Add An Employee",
                "Update An Employee Role"]
}
]

const endQuestions = [{
    name: "continue",
    message: "Continue or Quit?",
    type: "list",
    choices: ["Continue", "Quit"]
}]

const departmentName = [{
    name: "department_name",
    message: "Enter your new department name",
    type: "input"
}]

const addRoleQuestions = [{
    name: "roleName",
    message: "What is the name of your new role?",
    type: "input"
    }, {
    name: "roleSalary",
    message: "How much money does your new role make in one year?",
    type: "input"
    }, {
    name: "role_department",
    message: "Which department does your new role belong to? Beware, if you did not create the department it may cause errors.",
    type: "input"
    }
    ]

const addEmployeeQuestions = [{
        name: "employFirstName",
        message: "What is the first name of your new employee?",
        type: "input"
        }, {
        name: "employLastName",
        message: "What is the last name of your new employee?",
        type: "input"
        }, {
        name: "employRole",
        message: "What role is your new employee? (Make sure that the role exists)",
        type: "input"
        }
    ]

const updateEmployee = [{
    name: "employId",
    message: "What is the ID of the employee you want to update?",
    type: "input"
    }, {
    name: "newRole",
    message: "What is the ID of their new role?",
    type: "input"
    }]


//show all contents of department table
const showDepartments = () => {
    db.query('SELECT * FROM department', (error, results, fields) => {
        if(error) throw error;
        console.table(results)
        continuePrompt();
    });
}

//show all contents of role table
const showRoles = () => {
    db.query('SELECT * FROM role', (error, results, fields) => {
        if(error) throw error;
        console.table(results)
        continuePrompt();
    });
}

//show all contents of employee table
const showEmployees = () => {
    db.query('SELECT * FROM employee', (error, results, fields) => {
        if(error) throw error;
        console.table(results)
        continuePrompt();
    });
}

//prompt to quit or continue
const continuePrompt = () => {
    inquirer.prompt(endQuestions)
    .then(answers => {
        if(answers.continue === "Continue") {
            init();
        } else {
            process.exit();
        }
    })
}

//initial prompt
const init = () => {
    inquirer.prompt(questions)
.then(answers => {
   if(answers.select === "View All Departments") {
        showDepartments();
    }

    if(answers.select === "View All Roles") {
        showRoles();
    }

    if(answers.select === "View All Employees") {
        showEmployees();
    }

    if(answers.select === "Add A Department") {
        inquirer.prompt(departmentName)
        .then(answers => {
             db.query('INSERT INTO department (department_name) VALUES ("' + answers.department_name +'")', (err, result, fields) => {
                if (err) throw err;
                console.log(answers.department_name + "added to the database.");
                showDepartments();
            });
        })
    }

    if(answers.select === "Add A Role") {
        inquirer.prompt(addRoleQuestions)
        .then(answers => {
            db.query('INSERT INTO role (title, salary, department_id) VALUES ("' + answers.roleName + '", ' + answers.roleSalary + ', (SELECT dep_id FROM department where department_name="' + answers.role_department + '"))', (error, result, fields) => {
                if (error) throw error;
                console.log(answers.roleName + ' has been added!');
                showRoles();
            });
        })
    }

    if(answers.select === "Add An Employee") {
        inquirer.prompt(addEmployeeQuestions)
        .then(answers => {
            db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES ("' + answers.employFirstName + '", "' + answers.employLastName + '", (SELECT id FROM role WHERE title="' + answers.employRole +'"))', (error, result, fields) => {
                if (error) throw error;
                console.log(answers.employFirstName + " was added!");
                showEmployees();
            })
        })
    }

    if(answers.select === "Update An Employee Role") {
        inquirer.prompt(updateEmployee)
        .then(answers => {
            db.query('UPDATE employee SET role_id = ' + answers.newRole + ' WHERE id = ' + answers.employId + ';', (error, result, fields) => {
                if(error) throw error;
                showEmployees();
            })
        })
    }

});
}

init();


