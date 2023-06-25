/**
 * @author Fabian Trujillo
 * Clase base para los routers que contienen rutas HTTP para los controladores.
 * Esta clase proporciona una instancia de Router de express y métodos básicos para agregar rutas.
 */
import {Router} from "express"

class routerClass{

    /**
     * Constructor que crea una instancia de Router de express.
    */
    router:Router
    constructor(){
        this.router = Router()
    }

}
export default routerClass