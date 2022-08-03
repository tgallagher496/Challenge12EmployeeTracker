const inquirer=require("inquirer")
const db = require("./config/connection")

require("console.table")

db.connect( ()=>{
    menu();
})

const menuQuestions=[
    {
        type:"list",
        name:"menu",
        message:"Choose the following option:",
        choices:["View All Departments","View All Roles","View All Employees","Add a Department","Add a Role","Add an Employee","Update an Employee Role"]
    }
]





function menu(){
inquirer.prompt(menuQuestions)
.then(response=>{
    if(response.menu==="View All Employees"){
        viewEmployees();
    }
    else if(response.menu==="Add an Employee"){
        addEmployee();
    }
})
}

function viewEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name,role.title,department.name,role.salary, CONCAT(mgr.first_name, " ", mgr.last_name) as manager

    FROM employee
    LEFT JOIN role ON role.id=employee.role_id
    LEFT JOIN department ON role.department_id=department.id
    LEFT JOIN employee AS mgr ON mgr.manager_id=employee.id`, (err,data)=>{

        console.table(data)
        menu()
    })
}

function addEmployee(){
    db.query("select title as name, id as value from role",(err,roleData)=>{
        db.query(`select CONCAT(first_name, " ",last_name) as name, id as value from employee where manager_id is null`,(err,managerData)=>{
            const employeeAddQuestions=[
                {
                    type:"input",
                    name:"first_name",
                    message:"What is your first name?"
                },
                {
                    type:"input",
                    name:"last_name",
                    message:"What is your last name?"
                },
                {
                    type:"list",
                    name:"role_id",
                    message:"Choose the following role title",
                    choices:roleData
                },
                {
                    type:"list",
                    name:"manager_id",
                    message:"Choose the following manager",
                    choices:managerData
                }
            ]
            inquirer.prompt(employeeAddQuestions).then(response=>{
                const parameters=[response.first_name,response.last_name,response.role_id, response.manager_id]
              db.query("INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)",parameters,(err,data)=>{
                viewEmployees();
              })

            })
        })
    })

}