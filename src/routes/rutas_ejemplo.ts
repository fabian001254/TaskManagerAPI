import express, {Request, Response, Router} from 'express'


const myRouter:Router= Router()


myRouter.get(
    '/',
    (req:Request, res:Response)=>{

        //Simular respuesta diferentes desde la API

        const numero= Math.floor(Math.random()*10)

        switch(numero){

            case 0:
                res.status(500)
                res.send("Internal Server Error")
                break
            case 1:
                res.status(400)
                res.send('Bad Request')
                break

            case 2:
                setTimeout(
                    ()=>{
                        res.send('Nos demoramos')
                    },
                    5000
                )
                break
            
            default:
                res.send('Hola plantilla TS!!!')


        }


        
        
    }
)

myRouter.get(
    '/mensaje/:msg',
    (req:Request, res:Response)=>{

        const myVar= req.params.msg
        
        res.send(`He recibido el mensaje ${myVar}`)
    }
)

export default myRouter