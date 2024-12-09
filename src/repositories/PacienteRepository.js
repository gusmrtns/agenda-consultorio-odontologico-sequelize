import PacienteDAO from '../daos/PacienteDAO.js';

class PacienteRepository {
  async criar(pacienteData) {
    return await PacienteDAO.criar(pacienteData);
  }

  async buscarPorCPF(cpf) {
    return await PacienteDAO.buscarPorCPF(cpf);
  }

  async listar() {
    return await PacienteDAO.listar();
  }

  async excluir(cpf) {
    return await PacienteDAO.excluir(cpf);
  }
}

export default new PacienteRepository();
