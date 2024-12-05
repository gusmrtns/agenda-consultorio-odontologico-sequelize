import Paciente from '../models/Paciente';

class PacienteDAO {
  async criar(pacienteData) {
    return await Paciente.create(pacienteData);
  }

  async buscarPorCPF(cpf) {
    return await Paciente.findOne({ where: { cpf } });
  }

  async listar() {
    return await Paciente.findAll();
  }

  async excluir(cpf) {
    const paciente = await this.buscarPorCPF(cpf);
    if (paciente) {
      await paciente.destroy();
    }
  }
}

export default new PacienteDAO();
