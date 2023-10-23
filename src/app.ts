
import express,{ Application, NextFunction, Request, Response } from "express"
import {Prisma, PrismaClient} from "@prisma/client"
import dotenv from "dotenv"
import cors from "cors"
import CreateUsersRouter from "./routes/UserCreate/CreateUsersRouter"
import DatabaseStatusController from "./controllers/databaseStatus"
import jwt from "jsonwebtoken";
import authRouter from "./routes/Auth/authRouter"
dotenv.config()
/**
 * Clase principal de la api
 *  @author Fabian Trujillo
 *  @description Clase de la api
 */
	class App{
	private prismaClient:PrismaClient
	public app:Application
	private server:any
	private port:number
    
	/**
     * Metodo constructor
     */
	constructor(){
		this.app = express()
		this.app.use(express.json())		
		this.app.use(cors())
		this.routes()
		this.prismaClient = new PrismaClient()
		this.port = 3000
	}
	/*
		Definir rutas de express
	*/
	private routes():void{
		this.app.use("/",CreateUsersRouter);
		this.app.use("/",authRouter)
		this.app.use(
			(req:Request,res:Response,next:NextFunction)=>{
				res.status(404).json({message: "Resourse not found"})
				next()
			})
		
	}
	/*
		Metodo que inicia el servidor en el puerto 3000
	*/
	public async start(){
		const databaseStatusController = new DatabaseStatusController();
		try{
			await databaseStatusController.checkDatabaseConnection();
			this.server = this.app.listen(this.port,
				()=>{console.log("Server started in port",this.port)})
		}catch(e){
			console.log("Error turning on the server ",e)
		}
	}
	
	   

	public async close() {
		if (this.server) {
		  this.server.close();
		}
	  }
}
export default App