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

      // Criar a consulta
      await ConsultaRepository.criarConsulta({
        pacienteId: paciente.id,
        dataConsulta,
        horaInicio,
        horaFim,
      });

      ConsultaView.mostrarMensagem(`Consulta agendada com sucesso para ${paciente.nome} no dia ${dataConsulta}, das ${horaInicio} às ${horaFim}.`);

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
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    // Delegando toda a lógica ao repository
    await ConsultaRepository.excluirPorDados(paciente.id, dataConsulta, horaInicio);

    ConsultaView.mostrarMensagem(`Consulta para o paciente ${paciente.nome} no dia ${dataConsulta}, às ${horaInicio}, foi cancelada com sucesso.`);
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
        ConsultaView.mostrarErro('Erro ao listar a agenda: ' + error.message);
    }
}


  static async listarPorPeriodo() {
    try {
      const { dataInicio, dataFim } = await ConsultaView.obterPeriodo();
  
      // Ajuste o formato das datas para o formato ISO (yyyy-MM-dd)
      const inicioLuxon = DateTime.fromFormat(dataInicio, 'dd/MM/yyyy');
      const fimLuxon = DateTime.fromFormat(dataFim, 'dd/MM/yyyy');
  
      if (!inicioLuxon.isValid || !fimLuxon.isValid) {
        throw new Error('As datas fornecidas são inválidas. Use o formato DD/MM/YYYY.');
      }
  
      if (inicioLuxon > fimLuxon) {
        throw new Error('A data inicial não pode ser maior que a data final.');
      }
  
      const consultas = await ConsultaRepository.listarPorPeriodo(
        inicioLuxon.toISODate(),
        fimLuxon.toISODate()
      );
  
      ConsultaView.listarAgenda(consultas);
    } catch (error) {
      ConsultaView.mostrarErro(error.message);
    }
  }
  


}

export default ConsultaController;
