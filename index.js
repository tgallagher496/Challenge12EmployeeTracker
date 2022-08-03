const inquirer=require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");
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
    }else if(response.menu==="View All Departments"){
        viewDepartment()
    }else if(response.menu==="View All Roles"){
        viewRoles()
    }else if(response.menu==="Add a Department"){
        addDepartment();
    }else if(response.menu==="Add a Role"){
        addRole();
    }else if(response.menu==="Update an Employee Role"){
        updateRole();
    }
})
}

function viewEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name,role.title,department.name,role.salary, CONCAT(mgr.first_name, " ", mgr.last_name) as manager

    FROM employee
    LEFT JOIN role ON role.id=employee.role_id
    LEFT JOIN department ON role.department_id=department.id
    LEFT JOIN employee AS mgr ON employee.manager_id=mgr.id`, (err,data)=>{

        console.table(data)
        menu()
    })
}

function viewDepartment(){
    db.query(`select * from department`,(err,data)=>{
        console.table(data)
        menu()
    })
}

function viewRoles(){
    db.query(`SELECT role.id, role.title, department.name as department, role.salary
    FROM role
    LEFT JOIN department ON role.department_id=department.id`,(err,data)=>{
        console.table(data)
        menu()
    })
}

function updateRole(){
db.query(`select CONCAT(first_name, " ",last_name) as name FROM employee`,(err,updateData)=>{
    db.query(`SELECT title as name FROM role`,(err,changeRole)=>{
    const personChange=[
        {
            type:"list",
            name:"name",
            message:"Which employee would you like to change the role of?",
            choices: updateData
        }
    ]
    inquirer.prompt(personChange).then(response=>{
        const parameters=[response.name]
        console.log(`You have chosen to change ${response.name}'s role`)
        
            const roleChange=[
                {
                    type:"list",
                    name:"title",
                    message:"What would you like to change the role to?",
                    choices: changeRole
                }
            ]
        
            inquirer.prompt(roleChange).then(response=>{
                const parameters=[response.title]
                console.log(`You have chosen to change the role to ${response.title}`)
                db.query(`UPDATE employee_db SET title = response.title WHERE CONCAT(first_name, " ",last_name) as name is response.name`,(err,changedData)=>{
                    viewEmployees()
                 })
            })
            
         })

    })
})


 
}

function addDepartment(){
    const departmentAddQuestions=[
        {
            type:"input",
            name:"name",
            message:"What is the name of the new department?"
        }
    ]

    inquirer.prompt(departmentAddQuestions).then(response=>{
        const parameters=[response.name]
      db.query("INSERT INTO department (name) VALUES(?)",parameters,(err,data)=>{
        viewDepartment();
      })

    })

}

function addRole(){
    db.query("select name as name, id as value from department",(err,departmentData)=>{
        const addRoleQuestions=[
            {
                type:"input",
                name:"title",
                message: "What is the name of the new role?"
            },
            {
                type:"input",
                name:"salary",
                message:"What is the salary of this new role?"
            },
            {
                type:"list",
                name:"department_id",
                message:"Choose the following department",
                choices:departmentData
            }
        ]
        inquirer.prompt(addRoleQuestions).then(response=>{
            const parameters=[response.title,response.salary,response.department_id]
          db.query("INSERT INTO role (title,salary,department_id) VALUES(?,?,?)",parameters,(err,data)=>{
            viewRoles();
          })
    
        })

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