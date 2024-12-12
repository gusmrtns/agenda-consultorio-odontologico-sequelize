import Consulta from '../models/Consulta.js';
import Paciente from '../models/Paciente.js';

class ConsultaDAO {
  async criarConsulta(consultaData) {
    return await Consulta.create(consultaData);
  }

  async buscarPorId(id) {
    return await Consulta.findByPk(id);
  }

  async listar(options = {}) {
    return await Consulta.findAll({
      ...options,
      include: [{ model: Paciente, as: 'paciente' }],
    });
  }

  async excluir(id) {
    const consulta = await this.buscarPorId(id);
    if (consulta) {
      await consulta.destroy();
    }
  }
}

export default new ConsultaDAO();
