import { check} from "express-validator"

export const emailVerificator =[
    check("email").isEmail().normalizeEmail().withMessage("Invalid email format")
]
export const nameOrLastnameValidator = [
    check("name").isAlpha("es-ES",{ ignore: " " }).withMessage("Name invalide"),
    check("lastname").isAlpha("es-ES",{ ignore: " " }).withMessage("Lastname invalide")
]
