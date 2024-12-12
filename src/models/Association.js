// src/models/associations.js
import Paciente from './Paciente.js';
import Consulta from './Consulta.js';

// Função para configurar as associações
export default function associateModels() {
  Paciente.hasMany(Consulta, { foreignKey: 'pacienteId', as: 'consultas' });
  Consulta.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });
}
