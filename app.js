const nodemailer=require('nodemailer')
const express=require('express')
const bodyparser=require('body-parser')
const app=express()
const multer=require('multer')
const fs=require('fs')

const PORT=process.env.PORT || 3000

app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())



var to;
var subject;
var body;
var path;

const storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./images')
    },
    filename:function(req,file,callback){
        callback(null,file.fieldname + "_" + Date.now() + "_" + file.originalname)

    }
})

const upload=multer({
    storage:storage,

}).single('image');


app.get('/',(req,res) =>{
    res.sendFile('/index.html')
})

app.post('/sendemail',(req,res) =>{
    //execute the middleware
    upload(req,res,function(err) {
        if(err) {
            console.log(err)
            return res.send('Something went wrong')
        }

        else{
            to=req.body.to
            subject=req.body.subject
            body=req.body.body

            path=req.file.path
            console.log(to,subject,body,path)

            const transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'darjip559@gmail.com',
                    pass:'Vasantara7710'
                },
                tls: {
                  
                    rejectUnauthorized: false
                },
            })

            const mailOptions={
                from:'darjip559@gmail.com',
                to:to,
                subject:subject,
                text:body,
                attachments:[
                    {
                        path:path
                    }
                ]
            }
            
            transporter.sendMail(mailOptions,function(err,data){
                if(err){
                    console.log(err)

                }
                else{
                   console.log('Email sent',data.response) 
                    fs.unlink(path,function(err){
                        if(err) {
                            return res.send(err)
                        }
                        else{
                            console.log("deleted")
                            res.redirect('/result.html')
                        }
                    })
                }

            })

        }



    })
})


app.listen(PORT,() =>{
    console.log(`Server is running on ${PORT}`)
})