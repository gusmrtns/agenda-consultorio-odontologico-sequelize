import ConsultaDAO from '../daos/ConsultaDAO.js';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

class ConsultaRepository {
  /**
 * Criar uma consulta com validações.
 * @param {Object} consultaData - Dados da consulta.
 * @returns {Promise<Consulta>}
 */
async criarConsulta(consultaData) {
  const { pacienteId, dataConsulta, horaInicio, horaFim } = consultaData;

  // Validação: Horários múltiplos de 15 minutos
  if (!this._ehMultiploDe15(horaInicio) || !this._ehMultiploDe15(horaFim)) {
    throw new Error('Os horários devem ser múltiplos de 15 minutos.');
  }

  // Validação: Dentro do expediente
  const inicioMinutos = this._converterParaMinutos(horaInicio);
  const fimMinutos = this._converterParaMinutos(horaFim);
  const abertura = 8 * 60; // 08:00
  const fechamento = 19 * 60; // 19:00

  if (inicioMinutos < abertura || fimMinutos > fechamento) {
    throw new Error('Os horários devem estar dentro do expediente (08:00 às 19:00).');
  }

  // Validação: Período futuro
  const agora = DateTime.local();
  const dataLuxon = DateTime.fromFormat(dataConsulta, 'yyyy-MM-dd').set({
    hour: Math.floor(inicioMinutos / 60),
    minute: inicioMinutos % 60,
  });

  if(!dataLuxon.isValid) {
    throw new Error('Data inválida.');
  }

  if (dataLuxon <= agora) {
    throw new Error('A consulta deve ser para um período no futuro.');
  }

  // Validação: Sobreposição de horários para o mesmo paciente
  const consultas = await this.listar();
  const sobreposta = consultas.some(consulta => {
    const mesmaData = consulta.dataConsulta === dataLuxon.toISODate();
    const mesmoPaciente = consulta.pacienteId === pacienteId;
    const inicioExistente = this._converterParaMinutos(consulta.horaInicio);
    const fimExistente = this._converterParaMinutos(consulta.horaFim);

    return mesmaData && mesmoPaciente && (
      (inicioMinutos >= inicioExistente && inicioMinutos < fimExistente) || // Início dentro do intervalo
      (fimMinutos > inicioExistente && fimMinutos <= fimExistente) ||      // Fim dentro do intervalo
      (inicioMinutos <= inicioExistente && fimMinutos >= fimExistente)    // Intervalo engloba a existente
    );
  });

  if (sobreposta) {
    throw new Error('Horário indisponível para agendamento.');
  }

  consultaData.dataConsulta = dataLuxon.toISODate();

  // Persistir a consulta no banco
  return await ConsultaDAO.criarConsulta(consultaData);
}


  /**
   * Excluir uma consulta por pacienteId, data e hora.
   * @param {number} pacienteId - ID do paciente.
   * @param {string} dataConsulta - Data da consulta no formato DD/MM/YYYY.
   * @param {string} horaInicio - Hora de início da consulta no formato HHMM.
   * @returns {Promise<void>}
   */
  async excluirPorDados(pacienteId, dataConsulta, horaInicio) {
    const consulta = await ConsultaDAO.listar({
      where: {
        pacienteId,
        dataConsulta: DateTime.fromFormat(dataConsulta, 'yyyy-MM-dd').toISODate(),
        horaInicio,
      },
    });

    if (!consulta) {
      throw new Error('Consulta não encontrada.');
    }

    const agora = DateTime.local();
    const dataLuxon = DateTime.fromFormat(dataConsulta, 'yyyy-MM-dd').set({
      hour: parseInt(horaInicio.slice(0, 2), 10),
      minute: parseInt(horaInicio.slice(2), 10),
    });

    if (dataLuxon <= agora) {
      throw new Error('Não é possível cancelar consultas passadas.');
    }

    await ConsultaDAO.excluir(consulta.id);
  }

  async listar() {
    return await ConsultaDAO.listar({
        include: [{ association: 'paciente' }], // Incluir informações do paciente
        order: [['dataConsulta', 'ASC'], ['horaInicio', 'ASC']], // Ordenar por data e hora de início
    });
}


  async listarPorPeriodo(dataInicio, dataFim) {
    return await ConsultaDAO.listar({
      where: {
        dataConsulta: {
          [Op.between]: [dataInicio, dataFim],
        },
      },
      include: [
        {
          association: 'paciente',
          attributes: ['nome', 'cpf'], // Certifique-se de que os atributos necessários estão incluídos
        },
      ],
      order: [['dataConsulta', 'ASC'], ['horaInicio', 'ASC']],
    });
  }


  // Métodos auxiliares

  _ehMultiploDe15(horario) {
    const minutos = this._converterParaMinutos(horario);
    return minutos % 15 === 0;
  }

  _converterParaMinutos(horario) {
    const horas = parseInt(horario.slice(0, 2), 10);
    const minutos = parseInt(horario.slice(2), 10);
    return horas * 60 + minutos;
  }

}

export default new ConsultaRepository();
