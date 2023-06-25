import Controller from "./controller";
import { Response, Request} from "express";
import bcrypt from "bcrypt"

interface UserO {
  username: string;
  rol: string;
  email: string;
  name: string;
  password: string;
  lastname: string;
}

interface UserN {
  username: string;
  rol: string;
  email: string;
  password: string;
}



class CreateUsersController extends Controller {

  validateUserO(data: any): data is UserO {
    return (
      typeof data.username === 'string' &&
      typeof data.rol === 'string' &&
      typeof data.email === 'string' &&
      typeof data.name === 'string' &&
      typeof data.password === 'string' &&
      typeof data.lastname === 'string'
    );
  }
  
  validateUser(data: any): data is UserN {
    return (
      typeof data.username === 'string' &&
      typeof data.rol === 'string' &&
      typeof data.email === 'string' &&
      typeof data.password === 'string'
    );
  }

  validateRol(data: string) {
    const roles = ["TEACHER", "ADMIN", "STUDENT"];
    return roles.includes(data.toUpperCase());
  }
  
  validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  } 
  validateName(name:string) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  }
  
  validateLastName(lastName:string) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(lastName);
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
  

  async createUser(req: Request, res: Response) {
    try {
      const User = req.body;

      if (this.validateUser(User) || this.validateUserO(User)) {
        const validatedData = req.body;
        
        if(!this.validateEmail(validatedData.email)) {
          return res.status(400).json({
            message: 'Invalid email format',
          });
        }   
        
        if (await this.userValidate(validatedData)) {
          return res.status(400).json({
            message: 'User already exists'
          });
        }
        
        if (!this.validateName(validatedData.name)) {
          return res.status(400).json({
            message: 'Invalid name format',
          });
        }
        
        if (!this.validateLastName(validatedData.lastname)) {
          return res.status(400).json({
            message: 'Invalid last name format',
          });
        }
        
        
        validatedData.rol = validatedData.rol.toUpperCase()
        
        const rol = this.validateRol(validatedData.rol);
        if (!rol) {
            return res.status(400).json({
              message: 'Invalid Rol'
            });
          }  
          
        const password = validatedData.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        validatedData.password = hashedPassword;
        try{
          //Antes de crear validar si es un usuario admin el que va a crear un admin :D
          const user = await this.prismaClient.user.create({data: validatedData})
          user.password = "Hidden for security"
          return res.status(201).json({ message: "Created successfully", user});
        }catch(err){
          res.status(500).json({ message: "Internal Error"});
        }
        
      }

      }catch (e){
        res.status(500).json({ message: "Internal Error"});
      }
    }
}

export default CreateUsersController;
