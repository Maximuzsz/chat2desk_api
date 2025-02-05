import * as bcrypt from 'bcryptjs';
import { UserModel } from "../models/UserModel";
import { AppError } from "../utils/AppError";
import { jwtUtils } from "../utils/jwtUtils";
import { emailProducer } from "../jobs/emailProducer";

interface AuthResponse {
  token: string;
  usuario_id: string;
  nome: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AuthService = {
  async authenticateUser(email: string, senha: string): Promise<AuthResponse> {
    try {
      if (!email || !senha) {
        throw new AppError(400, "E-mail e senha são obrigatórios");
      }

      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        throw new AppError(401, "Credenciais inválidas");
      }

      await AuthService.validatePassword(senha, user.senha);
      // Enviar o e-mail de confirmação de login
      await emailProducer.sendEmailToQueue(
        email,
        'Confirmação de Login',
        `Olá, ${email}, seu login foi bem-sucedido!`
      );
      return AuthService.generateAuthResponse(user);
    } catch (error: any) {
      console.error("Erro na autenticação:", error.message);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(500, "Erro interno ao processar a autenticação");
    }
  },

  async validatePassword(password: string, hashedPassword: string) {
    try {
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (!isPasswordValid) {
        throw new AppError(401, "Credenciais inválidas");
      }
    } catch (error: any) {
      console.error("Erro ao validar senha:", error.message);
      throw new AppError(500, "Erro interno ao validar senha");
    }
  },

  generateAuthResponse(user: any): AuthResponse {
    try {
      return {
        token: jwtUtils.generateToken(user.usuario_id),
        usuario_id: user.usuario_id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error: any) {
      console.error("Erro ao gerar resposta de autenticação:", error.message);
      throw new AppError(500, "Erro interno ao gerar token de autenticação");
    }
  },
};
