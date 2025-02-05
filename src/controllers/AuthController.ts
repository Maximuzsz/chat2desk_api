import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { AppError } from "../utils/AppError";
import { emailProducer } from "../jobs/emailProducer";

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Operações relacionadas à autenticação de usuários
 */
export const AuthController = {
  /**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuário
 *     description: Realiza a autenticação de um usuário com e-mail e senha.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: O endereço de e-mail do usuário.
 *                 example: usuario@exemplo.com
 *               senha:
 *                 type: string
 *                 description: A senha do usuário.
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token de autenticação.
 *                       example: "jwt_token_aqui"
 *       400:
 *         description: Requisição inválida. E-mail ou senha ausentes.
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro interno no servidor.
 */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;
      const data = await AuthService.authenticateUser(email, senha);
      res.status(200).json({ data }); 
    } catch (error: any) {
      console.error("Erro no login:", error.message);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro interno no servidor" });
      }
    }
  },
};
