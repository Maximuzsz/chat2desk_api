import amqp from 'amqplib';
import { AppError } from '../utils/AppError';

// Configurar o RabbitMQ
const RABBITMQ_URL = 'amqp://localhost'; 
const QUEUE_NAME = 'emailQueue'; 

export const emailProducer = {
  async sendEmailToQueue(to: string, subject: string, text: string): Promise<void> {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();

      // Garantir que a fila existe
      await channel.assertQueue(QUEUE_NAME, { durable: true });

      // Criar a mensagem a ser enviada
      const emailMessage = JSON.stringify({ to, subject, text });

      // Enviar a mensagem para a fila
      channel.sendToQueue(QUEUE_NAME, Buffer.from(emailMessage), { persistent: true });

      console.log(`Mensagem de e-mail enfileirada para ${to}`);

      // Fechar a conexão e o canal após enviar a mensagem
      setTimeout(() => {
        channel.close();
        connection.close();
      }, 500);
    } catch (error) {
      console.error('Erro ao enviar mensagem para fila:', error);
      throw new AppError(500, 'Erro ao enviar e-mail para a fila');
    }
  },
};
