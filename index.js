const express = require('express');
const app = express();
const moment = require('moment');
const fs = require('fs');
const winston = require('winston');


// ZOO EXERCISE
app.get('/', function (req, res) {
    class Animal{
        constructor(name,sound,speach){
            this.name=name,
            this.sound=sound,
            this.speach=speach
        }
        speak(){
            return this.speach.split(" ").map(w => `${w} ${this.sound}`).join(" ");
        }
    }
    let lion=new Animal('Lion','roar',`I'm a lion`)
    let tiger=new Animal('Tiger','grrr',`Lions suck`)
    let pato=new Animal('Duck','cuak',`Feline cant eat me`)

    res.send(lion.speak()+"<br>"+tiger.speak()+"<br>"+pato.speak())
})

// URL PARSER EXERCISE
app.get('/:version/api/:collection/:id', function (req, res) {
 
    const q=req.query
    const p=req.params

    res.send(Object.assign(p,q))
})

// ERROR ALARM EXERCISE
app.use((err,req,res,next)=>{
    logError( err.message )
    res.status(500).send("Algo salio mal");
})

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' ,'timestamp':true}),
    ],
  });

function logError( error ){

    logger.error(error)

    const options = {
        from: new Date() - (10 * 60 * 1000),
        until: new Date(),
        limit: 10,
        start: 0,
        order: 'desc',
        fields: ['message','timestamp']
    };
      
    logger.query(options, function (err, results) {
        if (err) {
          throw err;
        }
        if(results.file.length >= 10){
            const fecha=fs.readFileSync('reportado.log', 'utf8')
            let now = moment(new Date())
            let file_date = moment(new Date(fecha))

            if(now.diff(file_date,'minutes') >=  1){

                console.log('Se envia Email de notificacion con log correspondiente:')
                console.log(results)

                fs.writeFile('reportado.log',new Date().toString(),(err)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        }
    });
}


app.listen(3000)

