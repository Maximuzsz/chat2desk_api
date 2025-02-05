import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { UserModel } from "../models/UserModel";
import { emailProducer } from "../jobs/emailProducer";

const prisma = new PrismaClient();

export const userService = {
  // Função para criar um novo usuário
  async createUser(email: string, nome: string, senha: string) {
    try {
      // Validação dos campos obrigatórios
      if (!email || !nome || !senha) {
        throw new AppError(400, "E-mail, nome e senha são obrigatórios");
      }

      // Verifica se já existe um usuário com o mesmo e-mail
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) {
        throw new AppError(400, "Usuário já existe");
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Cria o novo usuário
      const user = await UserModel.createUser(
        email,
        nome,
        hashedPassword,
      );

      // Enviar o e-mail de confirmação de cadastro
      await emailProducer.sendEmailToQueue(
        email,
        'Confirmação de Cadastro',
        `Olá, ${nome}, seu cadastro foi realizado com sucesso!`
      );
      return user;
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error.message);
      throw new AppError(500, "Erro ao criar usuário");
    }
  },

};
