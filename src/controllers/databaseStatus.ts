import Controller from "./controller";

class DatabaseStatusController extends Controller {
  async checkDatabaseConnection() {
    try {
      await this.prismaClient.$connect();
      console.log("Database connection established successfully.");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      process.exit(1); // Terminar la ejecución de la aplicación si no se puede conectar a la base de datos
    } finally {
      await this.prismaClient.$disconnect();
    }
  }
}

export default DatabaseStatusController;
