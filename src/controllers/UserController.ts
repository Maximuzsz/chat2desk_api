import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { AppError } from "../utils/AppError";


/**
 * @swagger
 * tags:
 *   - name: Usuario
 *     description: Operações relacionadas à informações de usuários
 *     
 */
export const UserController = {
  /**
   * @swagger
   * /api/usuarios:
   *   get:
   *     summary: Retorna todos os usuários
   *     tags: [Usuario]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de todos os usuários
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   nome:
   *                     type: string
   *                   email:
   *                     type: string
   *       500:
   *         description: Erro no servidor
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.getAllUsers(); // Método para buscar todos os usuários
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  },

  /**
   * @swagger
   * /api/usuarios/{id}:
   *   get:
   *     summary: Retorna um usuário específico pelo ID
   *     tags: [Usuario]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID do usuário
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuário encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 nome:
   *                   type: string
   *                 email:
   *                   type: string
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro no servidor
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const user = await UserModel.getUserByID(Number(id)); // Método para buscar usuário pelo ID

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  },

  /**
 * @swagger
 * /api/register:
 *   post:
 *     summary: "Registrar um novo usuário"
 *     description: "Rota para criar um novo usuário com e-mail, nome e senha."
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *             required:
 *               - email
 *               - nome
 *               - senha
 *     responses:
 *       201:
 *         description: "Usuário registrado com sucesso."
 *       400:
 *         description: "Erro ao registrar usuário (usuário já existe)."
 *       500:
 *         description: "Erro interno no servidor."
 */
  async register(req: Request, res: Response): Promise<void> {
    const { email, nome, senha } = req.body;

    try {
      // Criação do novo usuário
      const user = await UserModel.createUser(email, nome, senha);      
      res.status(201).json({
        message: "Usuário registrado com sucesso",
        user: {
          usuario_id: user.usuario_id,
          nome: user.nome,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error.message);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro interno ao registrar o usuário", error: error.message });
      }
    }
  },

  /**
   * @swagger
   * /api/usuario/{usuario_id}:
   *   put:
   *     summary: Atualizar um usuário
   *     description: Atualiza as informações de um usuário existente.
   *     tags: [Usuario]
   *     security:
 *         - bearerAuth: []
   *     parameters:
   *       - name: usuario_id
   *         in: path
   *         description: ID do usuário
   *         required: true
   *         schema:
   *           type: integer
   *       - in: body
   *         name: user
   *         description: Dados do usuário para atualizar
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *               example: "usuario@example.com"
   *             nome:
   *               type: string
   *               example: "Nome do Usuário"
   *             senha:
   *               type: string
   *               example: "senha123"
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso
   *       400:
   *         description: ID de usuário inválido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno no servidor
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params; // Assumindo que o ID do usuário vem na URL
    const { email, nome, senha } = req.body; // Dados para atualização

    try {
      // Verificar se o usuário existe
      const user = await UserModel.getUserByID(parseInt(usuario_id));
      if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
      }

      // Atualizar usuário
      const updatedUser = await UserModel.updateUser(parseInt(usuario_id), { email, nome, senha });
      
      res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno ao atualizar usuário', error });
      }
    }
  },

    /**
   * @swagger
   * /api/usuario/{usuario_id}:
   *   patch:
   *     summary: Atualizar parcialmente um usuário
   *     description: Atualiza informações de um usuário de forma parcial (apenas campos fornecidos).
   *     tags: [Usuario]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: usuario_id
   *         in: path
   *         description: ID do usuário
   *         required: true
   *         schema:
   *           type: integer
   *       - in: body
   *         name: user
   *         description: Dados do usuário para atualizar parcialmente
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             nome:
   *               type: string
   *               example: "Novo Nome"
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso
   *       400:
   *         description: ID de usuário inválido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno no servidor
   */
  async patchUser(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params; // ID do usuário
    const { email, nome, senha } = req.body; // Campos que podem ser atualizados

    try {
      // Verificar se o usuário existe
      const user = await UserModel.getUserByID(parseInt(usuario_id));
      if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
      }

      // Atualizar parcialmente os campos fornecidos
      const updatedUser = await UserModel.partialUpdateUser(parseInt(usuario_id), { email, nome, senha });

      res.status(200).json({
        message: 'Usuário atualizado parcialmente com sucesso',
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno ao atualizar usuário parcialmente', error });
      }
    }
  },

  /**
   * @swagger
   * /api/usuario/{usuario_id}:
   *   delete:
   *     summary: Deletar um usuário
   *     description: Deleta um usuário com base no ID fornecido.
   *     tags: [Usuario]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: usuario_id
   *         in: path
   *         description: ID do usuário
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuário deletado com sucesso
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno no servidor
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params; // ID do usuário a ser excluído

    try {
      // Verificar se o usuário existe
      const user = await UserModel.getUserByID(parseInt(usuario_id));
      if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
      }

      // Deletar o usuário
      await UserModel.deleteUser(parseInt(usuario_id));

      res.status(200).json({
        message: 'Usuário deletado com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno ao deletar usuário', error });
      }
    }
  },
};
