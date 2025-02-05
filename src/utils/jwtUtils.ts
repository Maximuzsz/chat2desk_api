import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Definindo um tipo para o payload do JWT
interface JwtPayloadWithUserId extends JwtPayload {
  userId: number;
}

export const jwtUtils = {
  // Função para gerar o token
  generateToken(userId: number): string {
    // Garante que o JWT_SECRET está configurado corretamente
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  },

  // Função para verificar e decodificar o token
  verifyToken(token: string): JwtPayloadWithUserId {
    try {
      // Verificando e decodificando o token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;
      console.log(decoded)
      return decoded;
    } catch (err) {
      // Se o token for inválido ou expirado, tratamos o erro
      throw new Error('Token inválido ou expirado');
    }
  },
};
