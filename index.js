const express = require("express")
const app = express()
const db = require('./models')
const { user } = require("./models")
const path = require('path')
const fs = require('fs')
var base64ToImage = require('base64-to-image')

app.set('view engine','ejs')

global.__dirname = __dirname

app.use(express.static(path.join(__dirname,'./dist')))
app.use(express.static(path.join(__dirname,'./dist/models')))
app.use(express.static(path.join(__dirname,`./img`)))

app.get("/",(req,res)=>{

    user.findAll().then((users)=>{
        let nameList = []
        users.forEach(user => {
            let tmp = user.data
            let name = user.fname + " " + user.lname

            nameList.push(name)

            if(fs.existsSync(path.join(__dirname + `/img/${name}`))){
                console.log(`${name} is successful loaded`)
            }else{
                //create dir
                fs.mkdir(path.join(__dirname + `/img/${name}`),(err)=>{
                    if(err) res.send(err)
                })

                //save image
                const json = JSON.stringify({data:tmp.toString("base64")})
                var parsedJson = JSON.parse(json)
                var base64Str = "data:image/jpeg;base64," + parsedJson.data
                var p = path.join(__dirname + `/img/${name}/`)
                var opt = {'fileName':'1','type':'jpg'}

                base64ToImage(base64Str,p,opt)

                console.log(name + " is up-to-date now.")
            }
        });

        console.log(nameList)
        //res.sendFile(path.join(`${__dirname}/views/index.html`))
        res.render('index',{
            nameList : JSON.stringify(nameList),
        })
        

        

    }).catch((err)=>{
        res.send("error : " + err)
    })
})

db.sequelize.sync().then((req)=>{
    app.listen(3001,()=>{
        console.log("server running")
    })
})

