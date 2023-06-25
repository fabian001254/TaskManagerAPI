import CreateUsersController from "../controllers/CreateUsersController";
import routerClass from "./router";
import {Request,Response } from "express"

class CreateUsersRouter extends routerClass {
    createUsersController: CreateUsersController
    constructor() {
            super();
            this.createUsersController = new CreateUsersController();
            this.routes()
    }

    private routes():void{
        this.router.post("/users",
            (req:Request, res:Response)=>{
                this.createUsersController.createUser(req, res)
            }
        )
    }
}
export default new CreateUsersRouter().router