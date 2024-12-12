import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Consulta from './Consulta.js';

const Paciente = sequelize.define('Paciente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  timestamps: false,
});

export default Paciente;
