import CreateTasksController from "../../controllers/Task/CreateTasksController";
import routerClass from "../router";
import {Request,Response } from "express"

class CreateTaskRouter extends routerClass {
    createTasksController: CreateTasksController
    constructor() {
            super();
            this.createTasksController = new CreateTasksController();
            this.routes()
    }

    private routes():void{
        this.router.post("/task/create",
            (req:Request, res:Response)=>{
                this.createTasksController.createTask(req,res);
            }
        )
    }
}
export default new CreateTaskRouter().router