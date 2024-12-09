import Consulta from '../models/Consulta.js';

class ConsultaDAO {
  async criarConsulta(consultaData) {
    return await Consulta.create(consultaData);
  }

  async buscarPorId(id) {
    return await Consulta.findByPk(id);
  }

  async listar() {
    return await Consulta.findAll();
  }

  async excluir(id) {
    const consulta = await this.buscarPorId(id);
    if (consulta) {
      await consulta.destroy();
    }
  }
}

export default new ConsultaDAO();
