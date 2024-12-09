import ConsultaRepository from '../repositories/ConsultaRepository.js';
import PacienteRepository from '../repositories/PacienteRepository.js';
import ConsultaView from '../views/ConsultaView.js';
import { DateTime } from 'luxon';

class ConsultaController {
  /**
   * Agendar uma nova consulta.
   * Solicita os dados, valida e persiste a consulta no banco de dados.
   * @async
   * @returns {Promise<void>}
   */
  static async agendarConsulta() {
    try {
      const { cpf, dataConsulta, horaInicio, horaFim } = await ConsultaView.obterDadosConsulta();

      const paciente = await PacienteRepository.buscarPorCPF(cpf);
      if (!paciente) throw new Error('Paciente não encontrado.');

      // Validações específicas
      const consultas = await ConsultaRepository.listar();
      const consultaFutura = consultas.some(c => c.pacienteId === paciente.id && new Date(c.dataConsulta) > new Date());

      if (consultaFutura) throw new Error('O paciente já possui uma consulta futura.');

      // Criar a consulta
      const consulta = await ConsultaRepository.criarConsulta({
        pacienteId: paciente.id,
        dataConsulta,
        horaInicio,
        horaFim,
      });

      ConsultaView.mostrarMensagem(`Consulta agendada com sucesso para ${dataConsulta}, das ${horaInicio} às ${horaFim}.`);
    } catch (error) {
      ConsultaView.mostrarErro(error.message);
    }
  }

  /**
   * Cancelar uma consulta futura.
   * @async
   * @returns {Promise<void>}
   */
  static async cancelarConsulta() {
    try {
      const { cpf, dataConsulta, horaInicio } = await ConsultaView.obterDadosCancelamento();
      const paciente = await PacienteRepository.buscarPorCPF(cpf);

      if (!paciente) throw new Error('Paciente não encontrado.');

      const consultas = await ConsultaRepository.listar();
      const consulta = consultas.find(c => c.pacienteId === paciente.id && c.dataConsulta === dataConsulta && c.horaInicio === horaInicio);

      if (!consulta) throw new Error('Consulta não encontrada.');
      if (new Date(consulta.dataConsulta) <= new Date()) throw new Error('Não é possível cancelar consultas passadas.');

      await ConsultaRepository.excluir(consulta.id);
      ConsultaView.mostrarMensagem('Consulta cancelada com sucesso.');
    } catch (error) {
      ConsultaView.mostrarErro(error.message);
    }
  }

  /**
   * Listar a agenda completa.
   * @async
   * @returns {Promise<void>}
   */
  static async listarAgenda() {
    try {
      const consultas = await ConsultaRepository.listar();
      ConsultaView.listarAgenda(consultas);
    } catch (error) {
      ConsultaView.mostrarErro('Erro ao listar a agenda.');
    }
  }

  /**
   * Listar consultas em um período específico.
   * @async
   * @returns {Promise<void>}
   */
  static async listarPorPeriodo() {
    try {
      const { dataInicio, dataFim } = await ConsultaView.obterPeriodo();

      // Validação de formato de datas
      const inicioLuxon = DateTime.fromFormat(dataInicio, 'dd/MM/yyyy');
      const fimLuxon = DateTime.fromFormat(dataFim, 'dd/MM/yyyy');

      if (!inicioLuxon.isValid || !fimLuxon.isValid) {
        throw new Error('As datas fornecidas são inválidas. Use o formato DD/MM/YYYY.');
      }

      if (inicioLuxon > fimLuxon) {
        throw new Error('A data inicial não pode ser maior que a data final.');
      }

      const consultas = await ConsultaRepository.listarPorPeriodo(dataInicio, dataFim);
      ConsultaView.listarAgenda(consultas);
    } catch (error) {
      ConsultaView.mostrarErro(error.message);
    }
  }


}

export default ConsultaController;
