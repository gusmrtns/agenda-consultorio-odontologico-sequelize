import Paciente from '../models/Paciente.js';

class PacienteDAO {
  async criar(pacienteData) {
    return await Paciente.create(pacienteData);
  }

  async buscarPorCPF(cpf) {
    return await Paciente.findOne({ where: { cpf } });
  }

  async listar() {
    return await Paciente.findAll({
      include: [{ association: 'consultas' }], // Incluir as consultas associadas
      order: [['cpf', 'ASC']], // Ordenar por CPF
    });
    
  }

  async excluir(cpf) {
    const paciente = await this.buscarPorCPF(cpf);
    if (paciente) {
      await paciente.destroy();
    }
  }
}

export default new PacienteDAO();
