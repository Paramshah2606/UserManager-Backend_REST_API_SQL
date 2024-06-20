const express=require("express");
const app=express();
const port=8080;

const path=require("path");

const mysql = require('mysql2');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'REST',
  password: 'Param_2004'
});

const { faker } = require('@faker-js/faker');

let createRandomUser=()=> {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ]
};

// console.log(createRandomUser());
// let data=[];
// for(let i=0;i<50;i++){
//     data.push(createRandomUser());
// }

// let q=`CREATE TABLE users (id varchar(25),username varchar(25),email varchar(25),password varchar(25))`;
// let q1=`SELECT * FROM users`;
// let q2=`INSERT INTO users (id,username,email,password) VALUES ?`;
//   try{
//     connection.query(q2,[data],(err,result)=>{
//       if (err) throw err;
//       console.log(result);
//     });
//     } catch(err){
//       console.log(err);
//     }
    
//     connection.end();

app.listen(port,()=>{
    console.log("Server is listening at port 8080");
})

app.get("/",(req,res)=>{
    let q="SELECT COUNT(*) FROM users";
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            console.log(result[0]['COUNT(*)']);
            let user=result[0]['COUNT(*)'];
            res.render("home.ejs",{user});
        });
    }catch(err){
        console.log(err);
        res.send("Error in database");
    }
});

app.get("/users",(req,res)=>{
    let q1="SELECT * FROM users";
    try{
        connection.query(q1,(err,result)=>{
            if (err) throw err;
            // console.log(result);
            res.render("showusers.ejs",{result});
    });
    } catch(err){
        console.log(err);
        res.send("Error in database");
    }
});

app.get("/users/new",(req,res)=>{
    res.render("newuser.ejs");
})

app.post("/users",(req,res)=>{
    let {username,email,password}=req.body;
    const id=faker.string.uuid();
    let data=[id,username,email,password];
    console.log(data);
    let q2="INSERT INTO users (id,username,email,password) VALUES (?)";
    try{
        connection.query(q2,[data],(err,result)=>{
            if (err) throw err;
            console.log(result);
            res.redirect("/users");
        })
    }catch(err){
        console.log(err);
        res.send("Error in database");
    }
})

app.get("/users/:id/edit",(req,res)=>{
    const {id}=req.params;
    console.log(id);
    res.render("updateuser.ejs",{id});
})

app.patch("/users/:id",(req,res)=>{
    const {id}=req.params;
    const {username,password}=req.body;
    let q3=`SELECT password FROM users WHERE id="${id}"`;
    try{
        connection.query(q3,(err,result)=>{
            if (err) throw err;
            if(result[0].password==password){
                let q4=`UPDATE users set username="${username}" WHERE id="${id}"`;
                try{
                connection.query(q4,(er,resu)=>{
                    if(er) throw er;
                    res.redirect("/users");
                })
            }catch(er){
                res.send("Some error");
                console.log(er);
            }
            }
            else{
                res.render("wrongpass.ejs",{id});
            }
        });
    }catch(err){
        console.log(err);
        res.send("Some error in database");
    }
})

app.delete("/users/:id",(req,res)=>{
    const {id}=req.params;
    console.log(id);
    let q4=`DELETE FROM users WHERE id="${id}"`;
    try{
        connection.query(q4,(err,result)=>{
            if (err) throw err;
            // console.log(result);
            // res.send("Data deleted..");
            res.redirect("/users");
        })
    }catch(err){
        res.send("Some error in db");
        console.log(err);
    }
})