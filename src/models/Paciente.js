import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

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
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false,  // Não usar campos de timestamp (createdAt, updatedAt)
});

export default Paciente;
