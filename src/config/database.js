import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// hardcoded values because .env is not working
const sequelize = new Sequelize('clinic_db', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});


export default sequelize;
