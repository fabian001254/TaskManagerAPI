import {Response,Request} from "express"
import jwt from "jsonwebtoken"
import Controller from "../controller"
import { isDate, isValid } from 'date-fns';
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
    init_date: Date
}

function isValidDate(dateStr: string): boolean {
  // Expresiones regulares para los dos formatos
  const regex1 = /^\d{4}-\d{2}-\d{2}$/;
  const regex2 = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/;
  console.log(regex1.test(dateStr) || regex2.test(dateStr))
  return regex1.test(dateStr) || regex2.test(dateStr);
}



class CreateTasksController extends Controller{

    /**
     * Autentica a un usuario y devuelve un token si la autenticación es correcta.
     * @param req Objeto de solicitud de Express.
     * @param res Objeto de respuesta de Express.
     * @returns Token JWT si la autenticación es correcta.
     */

    validateTask(data: any): data is Task {
      return (
        typeof data.name === 'string' &&
        typeof data.description === 'string' 
      );
  }
  
      
      

    async userValidate(validatedData: any) {
        const validateUserOrEmail = await this.prismaClient.user.findFirst({
          where: {
            OR: [
              { username: validatedData.username },
              { email: validatedData.email }
            ]
          }
        });
      
        return validateUserOrEmail !== null; // Verificar si el usuario ya existe
      }
    async findUser(validatedData: any){
      const user = await this.prismaClient.user.findFirst({
        where: {
          OR: [
            { username: validatedData.username },
            { email: validatedData.email }
          ]
        }
      });
      return user;
    }


    async createTask(req: Request, res: Response) {

        if(req.body === undefined) {
            return res.status(401).json({ message: "The request body is empty" })
        }
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try{
          const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as TokenPayload; // Verifica el token y obtén los datos decodificados

        if (!await this.userValidate(decodedToken)) {
          try{
                const Task = req.body;
                const init_date = Task.init_date;
                const max_date = Task.max_date;
                if (this.validateTask(Task)) {
                    const validatedData = req.body;
                    if(!isValidDate(init_date) && !isValidDate(max_date)) {
                        return res.status(400).json({ message: "Date format incorrect or inexistent. The format is: 'yyyy-MM-dd' or 'yyyy-MM-dd HH:mm:ss"});
                    }
                    const User = await this.findUser(decodedToken.id);
                    validatedData.create_byID = User?.id_user;
                    if(validatedData.init_date > validatedData.max_date){
                        return res.status(400).json({ message: "The initial date cannot be greater than the final date."});
                    }

                    validatedData.init_date = new Date(`${init_date}Z`);
                    validatedData.max_date = new Date(`${max_date}Z`);
                    validatedData.status = "created";
                    try{
                        const task = await this.prismaClient.task.create({data: validatedData})
                        return res.status(201).json({ message: "Created successfully", task});
                    }catch(err){
                        res.status(500).json({ message: "Internal Error"});
                        console.log(err);
                    }

                }else{
                    res.status(400).json({ message: "The data is not complete."});
                }
            }catch(err){
                res.status(500).json({ message: "Internal Error"});
                console.log(err);
            }
          }else{
              return res.status(400).json({
                message: 'User not exists, please register!'
              });
          }
        }catch(err){
            return res.status(400).json({
              message: err
            });
        }
        
    }
    //TO-DO: ya esta hecha la creacion basada en usuario queda pendiente la eliminacion, actualizacion y lista de todas las tareas por usuario si no es del usuario no debe mosrarlo
}
export default CreateTasksController;