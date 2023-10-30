const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Noe',
    database: 'EmployeeDB'
});

connection.connect(err => {
    if (err) throw err;
    startApp();
});

function startApp() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Add a manager',
            'Update an employee role',
            'Update an employee manager',
            'Exit'
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add an employee':
                addEmployee();
                break
            case 'Add a role':
                addRole();
                break;
            case 'Add a manager':
                addManager();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;             
            case 'Update an employee manager':
                updateEmployeeManager();
                break;      
            case 'Exit':
                connection.end();
                break;
        }
    });
}

function viewDepartments() {
    const query = 'SELECT * FROM Departments';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function viewEmployees() {
    const query = 'SELECT * FROM Employees';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function viewRoles() {
    const query = 'SELECT * FROM Roles';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the new department:'
    })
    .then(answer => {
        const query = 'INSERT INTO Departments SET ?';
        connection.query(query, { DepartmentName: answer.departmentName }, (err, res) => {
            if (err) throw err;
            console.log('Department added successfully!');
            startApp();
        });
    });
}

function addRole() {
    inquirer.prompt([
        {
            name: 'RoleName',
            type: 'input',
            message: 'Enter the name of the new Role:'
        },
        {
            name: 'Salary',
            type: 'input',
            message: 'Enter the salary for the new Role:'
        }
    ])
    .then(answer => {
        const query = 'INSERT INTO Roles SET ?';
        connection.query(query, { Title: answer.RoleName, Salary: answer.Salary }, (err, res) => {
            if (err) throw err;
            console.log('Role added successfully!');
            startApp();
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the first name of the new employee:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter the last name of the new employee:'
        }
    ])
    .then(answer => {
        const query = 'INSERT INTO Employees SET ?';
        connection.query(query, { FirstName: answer.firstName, LastName: answer.lastName }, (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            startApp();
        });
    });
}

function updateEmployeeRole() {
    let employees;
    let roles;
    const queryEmployees = 'SELECT EmployeeID, CONCAT(FirstName, " ", LastName) AS EmployeeName FROM Employees';
    const queryRoles = 'SELECT RoleID, Title FROM Roles';

    connection.query(queryEmployees, (err, res) => {
        if (err) throw err;
        employees = res.map(employee => ({ name: employee.EmployeeName, value: employee.EmployeeID }));

        connection.query(queryRoles, (err, res) => {
            if (err) throw err;
            roles = res.map(role => ({ name: role.Title, value: role.RoleID }));

            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee\'s role do you want to update?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'list',
                    message: 'Select the new role for the employee:',
                    choices: roles
                }
            ])
            .then(answers => {
                const queryUpdate = 'UPDATE Employees SET RoleID = ? WHERE EmployeeID = ?';
                connection.query(queryUpdate, [answers.newRole, answers.employee], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully!');
                    startApp();
                });
            });
        });
    });
}
function updateEmployeeManager() {
    const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS Employee FROM Employees';
    connection.query(query, (err, employees) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee\'s manager do you want to update?',
                choices: employees.map(employee => ({
                    name: employee.Employee,
                    value: employee.id
                }))
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is the new manager for this employee?',
                choices: employees.map(employee => ({
                    name: employee.Employee,
                    value: employee.id
                }))
            }
        ])
        .then(answers => {
            const query = 'UPDATE Employees SET manager_id = ? WHERE id = ?';
            connection.query(query, [answers.manager, answers.employee], (err, res) => {
                if (err) throw err;
                console.log('Employee manager updated successfully!');
                startApp();
            });
        });
    });
}

function addManager() {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the manager\'s first name:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter the manager\'s last name:'
        }
    ])
    .then(answer => {
        const query = 'INSERT INTO Employees SET ?';
        connection.query(query, { first_name: answer.firstName, last_name: answer.lastName, is_manager: true }, (err, res) => {
            if (err) throw err;
            console.log('Manager added successfully!');
            startApp();
        });
    });
}
