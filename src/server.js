import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';

dotenv.config();

const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'Hello world!' });
  });

  app.use('*', notFoundHandler);
  app.use(errorHandler);


  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_FROM:', process.env.SMTP_FROM);
  

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;