import {Response,Request} from "express"
import jwt from "jsonwebtoken"
import Controller from "../controller"
interface TokenPayload {
    id: {
      id_user: number;
      username: string;
      rol: string;
      email: string;
      password: string;
      name: string;
      lastname: string;
    };
    iat: number;
    exp: number;
}

interface Task {
    name:string,
    description:string,
    max_date: Date,
    status:string
}




class taskController extends Controller{

    /**
     * Autentica a un usuario y devuelve un token si la autenticación es correcta.
     * @param req Objeto de solicitud de Express.
     * @param res Objeto de respuesta de Express.
     * @returns Token JWT si la autenticación es correcta.
     */

    async createTask(req: Request, res: Response) {
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as TokenPayload; // Verifica el token y obtén los datos decodificados

        


    }
}
export default taskController;