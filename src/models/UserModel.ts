import { userService } from "../services/UserService";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export const UserModel = {
  async createUser(email: string,nome:string, senha: string) {
    return await prisma.usuario.create({
      data: {
        email,
        senha: senha,
        nome,
      },
    });
  },

  async findUserByEmail(email: string) {
      try {
        const user = await prisma.usuario.findUnique({
          where: { email },
        });
  
        if (!user) {
          throw new AppError(404, "Usuário não encontrado");
        }
  
        return user;
      } catch (error: any) {
        console.error("Erro ao buscar usuário:", error.message);
        throw new AppError(500, "Erro ao buscar usuário");
      }
  },

  // Função para buscar um usuário pelo id
  async getUserByID(usuario_id: number) {
    try {
      const user = await prisma.usuario.findUnique({
        where: { usuario_id },
      });

      if (!user) {
        throw new AppError(404, "Usuário não encontrado");
      }

      return user;
    } catch (error: any) {
      console.error("Erro ao buscar usuário:", error.message);
      throw new AppError(500, "Erro ao buscar usuário");
    }
  },

  async getAllUsers(){
    try {
      const user = await prisma.usuario.findMany();
      if (!user) {
        throw new AppError(404, "Usuários não encontrados");
      }

      return user;
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error.message);
      throw new AppError(500, "Erro ao buscar usuários");
    }
  },

  async updateUser(usuario_id: number, data: { email: string; nome: string; senha: string }) {
    return prisma.usuario.update({
      where: { usuario_id },
      data,
    });
  },

  async partialUpdateUser(usuario_id: number, data: Partial<{ email: string; nome: string; senha: string }>) {
    return prisma.usuario.update({
      where: { usuario_id },
      data,
    });
  },

  async deleteUser(usuario_id: number) {
    return prisma.usuario.delete({
      where: { usuario_id },
    });
  },
};