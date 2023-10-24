import Controller from "../controller";
import { Response, Request} from "express";
import argon2 from "argon2";
import { emailVerificator } from "./validatorUserController";
import {validationResult} from "express-validator"
import jwt from "jsonwebtoken";

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
    if(req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "The request body is empty" })
    }
    try {
      const User = req.body;

      if (this.validateUser(User) || this.validateUserO(User)) {
        const validatedData = req.body;
        
        await Promise.all(emailVerificator.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return
        }  
        
        if (await this.userValidate(validatedData)) {
          return res.status(400).json({
            message: 'User already exists'
          });
        }
        
        if (!this.validateName(validatedData.name)) {
          return res.status(400).json({
            message: 'The name must only have letters',
          });
        }
        
        if (!this.validateLastName(validatedData.lastname)) {
          return res.status(400).json({
            message: 'The last name must only have letters',
          });
        }
        
        
        validatedData.rol = validatedData.rol.toUpperCase()
        const rol = this.validateRol(validatedData.rol);
        if (!rol) {
            return res.status(400).json({
              message: 'Invalid Rol'
            });
          }  

        if(validatedData.rol.toUpperCase() == "ADMIN"){
          const token = req.headers.authorization?.split(" ")[1]; // Obtiene el token bearer del encabezado

          if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as TokenPayload; // Verifica el token y obtén los datos decodificados

          // Verifica si el usuario tiene el rol de administrador
          if (decodedToken.id.rol !== "ADMIN") {
            return res.status(403).json({ message: "Only admins can create admin users" });
          }
        }
        const password = validatedData.password;
        const hashedPassword = await argon2.hash(password);
        validatedData.password = hashedPassword;
        try{
          const user = await this.prismaClient.user.create({data: validatedData})
          user.password = "Hidden for security"
          return res.status(201).json({ message: "Created successfully", user});
        }catch(err){
          res.status(500).json({ message: "Internal Error",err});
        }
        
      }else{
          res.status(400).json({ message: "The data is not complete."});
      }

      }catch (e){
        res.status(500).json({ message: "Internal Error"});
      }
    }
}

export default CreateUsersController;
