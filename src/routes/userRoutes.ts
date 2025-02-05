import { Router } from "express";
import { loginSchema, userSchema } from "../validations/userValidations";
import { validateRequest } from "../middlewares/validateRequest";
import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const authRoutes = Router();

authRoutes.post("/login", validateRequest(loginSchema), AuthController.login);
authRoutes.post("/register", validateRequest(userSchema), UserController.register);
authRoutes.get('/usuarios', authenticateJWT, UserController.getAllUsers);
authRoutes.get('/usuarios/:id', authenticateJWT, UserController.getUserById);
authRoutes.put('/usuario/:usuario_id', authenticateJWT, UserController.updateUser);
authRoutes.patch('/usuario/:usuario_id', authenticateJWT, UserController.patchUser);
authRoutes.delete('/usuario/:usuario_id', authenticateJWT, UserController.deleteUser);

export default authRoutes;
