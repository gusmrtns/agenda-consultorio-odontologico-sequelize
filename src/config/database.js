import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis do .env

const config = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  logging: process.env.DB_LOGGING === 'true', // Convertendo para booleano
};

export default config;
