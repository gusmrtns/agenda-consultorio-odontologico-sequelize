import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Paciente from './Paciente';

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
 
Consulta.belongsTo(Paciente, { foreignKey: 'pacienteId' }); // Relacionamento com Paciente

export default Consulta;