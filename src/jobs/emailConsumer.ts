import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError';

// Configuração do transporte do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'maximuzpaulo@gmail.com',
    pass: 'ijhw gcqp hqvg wjfu',
  },
});

// Configurar o RabbitMQ
const RABBITMQ_URL = 'amqp://localhost'; 
const QUEUE_NAME = 'emailQueue'; // Nome da fila

// Consumir mensagens da fila
const consumeEmails = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Garantir que a fila exista
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Aguardando mensagens na fila: ${QUEUE_NAME}`);

    // Processar as mensagens da fila
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const { to, subject, text } = JSON.parse(msg.content.toString());

        try {
          // Enviar o e-mail
          await transporter.sendMail({
            from: 'seu-email@gmail.com',
            to,
            subject,
            text,
          });

          console.log(`E-mail enviado para ${to}`);
          channel.ack(msg); // Confirmar que a mensagem foi processada com sucesso
        } catch (error) {
          console.error('Erro ao enviar o e-mail:', error);
          channel.nack(msg, false, true); // Recoloca a mensagem na fila em caso de erro
        }
      }
    });
  } catch (error) {
    console.error('Erro ao consumir mensagens:', error);
    throw new AppError(500, 'Erro ao consumir mensagens da fila');
  }
};

// Iniciar o consumidor
consumeEmails();
