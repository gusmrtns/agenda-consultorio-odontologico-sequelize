import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Paciente from './Paciente.js';

const Consulta = sequelize.define('Consulta', {
  dataConsulta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaInicio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horaFim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

export default Consulta;
