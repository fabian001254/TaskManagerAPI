import CreateUsersController from "../../controllers/UserCreate/CreateUsersController";
import routerClass from "../router";
import {Request,Response } from "express"

class CreateUsersRouter extends routerClass {
    createUsersController: CreateUsersController
    constructor() {
            super();
            this.createUsersController = new CreateUsersController();
            this.routes()
    }

    private routes():void{
        this.router.post("/users/register",
            (req:Request, res:Response)=>{
                this.createUsersController.createUser(req, res)
            }
        )
    }
}
export default new CreateUsersRouter().router