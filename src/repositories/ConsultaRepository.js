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
    const consultaDataHora = DateTime.fromISO(dataConsulta).set({ hour: Math.floor(inicioMinutos / 60), minute: inicioMinutos % 60 });
    if (consultaDataHora <= agora) {
      throw new Error('A consulta deve ser para um período no futuro.');
    }

    // Validação: Sobreposição de horários
    const consultas = await this.listar();
    const sobreposta = consultas.some(consulta => {
      const mesmaData = consulta.dataConsulta === dataConsulta;
      const mesmoPaciente = consulta.pacienteId === pacienteId;
      const inicioExistente = this._converterParaMinutos(consulta.horaInicio);
      const fimExistente = this._converterParaMinutos(consulta.horaFim);

      return mesmaData && mesmoPaciente && (
        (inicioMinutos >= inicioExistente && inicioMinutos < fimExistente) || // Início está dentro do intervalo
        (fimMinutos > inicioExistente && fimMinutos <= fimExistente) ||      // Fim está dentro do intervalo
        (inicioMinutos <= inicioExistente && fimMinutos >= fimExistente)    // Intervalo engloba a existente
      );
    });

    if (sobreposta) {
      throw new Error('Horário indisponível para agendamento.');
    }

    // Validação: Apenas uma consulta futura por paciente
    const consultaFutura = consultas.some(consulta => {
      const dataLuxon = DateTime.fromISO(consulta.dataConsulta);
      return consulta.pacienteId === pacienteId && dataLuxon > agora;
    });

    if (consultaFutura) {
      throw new Error('O paciente já possui uma consulta futura agendada.');
    }

    // Persistir a consulta no banco
    return await ConsultaDAO.criarConsulta(consultaData);
  }

  /**
   * Listar todas as consultas.
   * @returns {Promise<Array>}
   */
  async listar() {
    return await ConsultaDAO.listar();
  }

  /**
   * Excluir uma consulta pelo ID.
   * @param {number} id - ID da consulta.
   * @returns {Promise<void>}
   */
  async excluir(id) {
    await ConsultaDAO.excluir(id);
  }

  // Métodos auxiliares

  /**
   * Verifica se um horário é múltiplo de 15 minutos.
   * @param {string} horario - Horário no formato HHMM.
   * @returns {boolean}
   */
  _ehMultiploDe15(horario) {
    const minutos = this._converterParaMinutos(horario);
    return minutos % 15 === 0;
  }

  /**
   * Converte um horário no formato HHMM para minutos totais.
   * @param {string} horario - Horário no formato HHMM.
   * @returns {number}
   */
  _converterParaMinutos(horario) {
    const horas = parseInt(horario.slice(0, 2), 10);
    const minutos = parseInt(horario.slice(2), 10);
    return horas * 60 + minutos;
  }

  /**
   * Listar consultas em um intervalo de datas no formato DD/MM/YYYY.
   * @param {string} dataInicio - Data inicial no formato DD/MM/YYYY.
   * @param {string} dataFim - Data final no formato DD/MM/YYYY.
   * @returns {Promise<Array>}
   */
  async listarPorPeriodo(dataInicio, dataFim) {
    const dataInicioISO = DateTime.fromFormat(dataInicio, 'dd/MM/yyyy').toISODate();
    const dataFimISO = DateTime.fromFormat(dataFim, 'dd/MM/yyyy').toISODate();

    return await ConsultaDAO.listar({
      where: {
        dataConsulta: {
          [Op.between]: [dataInicioISO, dataFimISO],
        },
      },
      include: ['paciente'], // Incluir informações do paciente, se necessário
    });
  }

}

export default new ConsultaRepository();
