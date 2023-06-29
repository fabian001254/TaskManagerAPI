import authController from "../../controllers/Auth/authController"
import { Request, Response } from "express"
import routerClass from "../router";

class authRouter extends routerClass {
    AuthController: authController

    /**
     * Crea una instancia de authRouter.
     * @memberof authRouter
     */
    constructor() {
        // Llama al constructor de la clase padre
        super()
        this.AuthController = new authController()

        // Define las rutas para los endpoints GET y POST
        this.routes()
    }

    /**
     * Define las rutas para los endpoints GET y POST.
     * @memberof authRouter
     */
    private routes(): void {
        this.router.post("/users/login", (req: Request, res: Response) => {
            this.AuthController.autennticacion(req, res)
        })
    }
}

export default new authRouter().router
