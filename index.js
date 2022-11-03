const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table')
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee database.`)
);






function init() {
    console.log('init')
    inquirer.prompt({
        type: 'list',
        name: 'first',
        message: 'What would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit']
    })
        .then(answer => {

            if (answer.first === 'view all departments') {
                dep()
            }
            if (answer.first === 'view all roles') {
                rol()
            }
            if (answer.first === 'view all employees') {
                emp()
            }
            if (answer.first === 'add a department') {
                addDep()
            }
            if (answer.first === 'add a role') {
                addRol()
            }
            if (answer.first === 'add an employee') {
                addEmp()
            }
            if (answer.first === 'update an employee role') {
                updEmp()
            }
            if (answer.first === "quit") {
                return
            }
        })
};







let rolArray = []
let depArray = []


function pushToRolArray() {
    db.query('SELECT * FROM roles', function (err, results) {

        if (err) {
            console.log(err)
        }
        for (let i = 0; i < results.length; i++) {
            console.log(results[i])
            rolArray.push(results[i].title)
        }
        console.log(rolArray)

    })
}
function pushToDepArray() {
    db.query('SELECT * FROM departments', function (err, results) {

        if (err) {
            console.log(err)
        }
        for (let i = 0; i < results.length; i++) {
            depArray.push(results[i].name)
        }
        console.log(depArray)
        init()
    })
}


function dep() {
    db.query('SELECT * FROM departments', function (err, results) {

        if (err) {
            console.log(err)
        }
        console.table(results)
        init()
    })
}
function rol() {
    db.query('SELECT roles.title, roles.salary, departments.name AS department FROM roles JOIN departments ON roles.department_id = departments.id', function (err, results) {

        if (err) {
            console.log(err)
        }
        console.table(results)
        init()
    })
}
function emp() {
    db.query('SELECT * FROM employees', function (err, results) {

        if (err) {
            console.log(err)
        }
        console.table(results)
        init()
    })
}
function addDep() {

    inquirer.prompt({
        type: 'input',
        name: 'depName',
        message: "what is the name of the department?"
    })
        .then(answer => {
            db.query('INSERT INTO departments (name) VALUES (?)', answer.depName, function (err, results) {

                if (err) {
                    console.log(err)
                }
                console.log("department added")
                depArray.push(answer.depName)
                init()
            })

        })
}
function addRol() {

    inquirer.prompt([{
        type: 'input',
        name: 'rolName',
        message: "what is the title of the role?"
    },
    {
        type: 'input',
        name: 'rolSal',
        message: "what is the salary for this role?"
    },
    {
        type: 'list',
        name: 'rolDep',
        message: "what is the department for this role?",
        choices: depArray
    }]
    )
        .then(answer => {
            console.log(answer)
            const findIt = (element) => element === answer.rolDep
            console.log(depArray.findIndex(findIt))
            let depId = depArray.findIndex(findIt) + 1
            console.log(depId)
            db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answer.rolName, answer.rolSal, depId], function (err, results) {

                if (err) {
                    console.log(err)
                }
                console.log("role added")
                rolArray.push(answer.rolName)
                init()
            })

        })
}
function updEmp() {

    inquirer.prompt([{
        type: 'input',
        name: 'empId',
        message: "what is the employee's Id"
    },
    {
        type: 'list',
        name: 'empRol',
        message: "what is the employee's new role?",
        choices: rolArray
    }]
    )
        .then(answer => {

            console.log(answer)
            const findIt = (element) => element === answer.empRol
            console.log(rolArray.findIndex(findIt))
            let rolId = rolArray.findIndex(findIt) + 1
            console.log(rolId)
            db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [rolId, answer.empId], function (err, results) {

                if (err) {
                    console.log(err)
                }
                console.log("role updated")
                init()
            })



        })
}
function addEmp() {

    inquirer.prompt([{
        type: 'input',
        name: 'empFirst',
        message: "what is the first name of the employee?"
    },
    {
        type: 'input',
        name: 'empLast',
        message: "what is the last name of the employee?"
    },
    {
        type: 'list',
        name: 'empRol',
        message: "what is the employee's role?",
        choices: rolArray
    },
    {
        type: 'input',
        name: 'empMan',
        message: "what is the employee's manager's employee id?"
    }]
    )
        .then(answer => {
            let manager
            console.log(answer)
            const findIt = (element) => element === answer.empRol
            console.log(rolArray.findIndex(findIt))
            let rolId = rolArray.findIndex(findIt) + 1
            console.log(rolId)
            if (answer.empMan == '') {
                db.query('INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)', [answer.empFirst, answer.empLast, rolId], function (err, results) {

                    if (err) {
                        console.log(err)
                    }
                    console.log("role added")
                    init()
                })
            }
            else {
                db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.empFirst, answer.empLast, rolId, answer.empMan], function (err, results) {

                    if (err) {
                        console.log(err)
                    }
                    console.log("role added")
                    init()
                })
            }


        })
}



pushToRolArray()
pushToDepArray()