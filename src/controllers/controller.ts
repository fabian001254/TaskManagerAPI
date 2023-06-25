/**
 * @author Fabian Trujillo
 * Clase base para los controladores tengran el objeto prisma
 */
import { PrismaClient } from "@prisma/client"
class Controller {
    /**
     * Clase padre que contiene la instancia del cliente de Prisma
     * y es la base para la creación de los controladores específicos.
     */
    public prismaClient: PrismaClient

    /**
     * Crea una instancia del cliente de Prisma y la asigna a la propiedad `prismaClient`.
     */
    constructor() {
        this.prismaClient = new PrismaClient()
    }
}

export default Controller
