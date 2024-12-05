import {Consulta} from '../models/Consulta.js';
import Agenda from '../models/Agenda.js';
import {DateTime} from 'luxon';

/**
 * Fábrica responsável por criar consultas, validando as informações antes.
 * @class
 */
export class ConsultaFactory {

    /**
     * Cria uma nova consulta após validações.
     * Verifica se o horário é válido, se a consulta é para o futuro, e se há sobreposição com outras consultas.
     * @param {Paciente} paciente - O paciente para quem a consulta está sendo agendada.
     * @param {string} dataConsulta - A data da consulta no formato 'DD/MM/AAAA'.
     * @param {string} horaInicio - A hora de início da consulta no formato 'HHMM'.
     * @param {string} horaFim - A hora de término da consulta no formato 'HHMM'.
     * @returns {Object} - Retorna um objeto com a propriedade `valido` indicando se a consulta foi criada com sucesso,
     * ou `erro` com a mensagem de erro caso a validação falhe, e a instância de `Consulta` se válida.
     */
    static criarConsulta(paciente, dataConsulta, horaInicio, horaFim) {
        const horarioValido = this.validarHorario(horaInicio, horaFim);
        if (!horarioValido.valido) {
            return { valido: false, erro: horarioValido.erro };
        }

        if (!this.ehFuturo(dataConsulta)) {
            return { valido: false, erro: "A consulta deve ser para um período futuro." };
        }

        if (!this.verificarSobreposicao(dataConsulta, horaInicio, horaFim)) {
            return { valido: false, erro: "Horário indisponível para agendamento." };
        }

        const consulta = new Consulta(paciente, dataConsulta, horaInicio, horaFim);
        return { valido: true, consulta };
    }

    /**
     * Valida se o horário de início e término da consulta estão de acordo com as regras.
     * @param {string} horaInicio - Hora de início no formato 'HHMM'.
     * @param {string} horaFim - Hora de término no formato 'HHMM'.
     * @returns {Object} - Retorna um objeto com `valido` (booleano) e `erro` (mensagem de erro, se houver).
     */
    static validarHorario(horaInicio, horaFim) {
        const inicio = this.converterParaMinutos(horaInicio);
        const fim = this.converterParaMinutos(horaFim);
        const abertura = 8 * 60; // Abertura às 8:00
        const fechamento = 19 * 60; // Fechamento às 19:00

        if (fim <= inicio) {
            return { valido: false, erro: "A hora final deve ser maior que a hora inicial." };
        }

        if (!this.ehIntervaloDe15Minutos(inicio) || !this.ehIntervaloDe15Minutos(fim)) {
            return { valido: false, erro: "Horários devem ser múltiplos de 15 minutos." };
        }

        if (inicio < abertura || fim > fechamento) {
            return { valido: false, erro: "Horários fora do expediente (8:00 às 19:00)." };
        }

        return { valido: true };
    }

    /**
     * Verifica se a data da consulta é no futuro em relação ao dia de hoje.
     * @param {string} dataConsulta - A data da consulta no formato 'DD/MM/AAAA'.
     * @returns {boolean} - Retorna `true` se a data da consulta for futura, ou `false` caso contrário.
     */
    static ehFuturo(dataConsulta) {
        const hoje = DateTime.local();
        const dataConsultaLuxon = DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy');
        return dataConsultaLuxon > hoje;
    }

    /**
     * Verifica se a consulta tem sobreposição com outras consultas já agendadas.
     * @param {string} dataConsulta - A data da consulta no formato 'DD/MM/AAAA'.
     * @param {string} horaInicio - Hora de início da consulta no formato 'HHMM'.
     * @param {string} horaFim - Hora de término da consulta no formato 'HHMM'.
     * @returns {boolean} - Retorna `true` se não houver sobreposição, `false` se houver sobreposição de horário.
     */
    static verificarSobreposicao(dataConsulta, horaInicio, horaFim) {
        const agenda = Agenda.getInstance();
        const inicio = this.converterParaMinutos(horaInicio);
        const fim = this.converterParaMinutos(horaFim);
        const dataConsultaLuxon = DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy');

        return !agenda.getConsultas().some(consulta => {
            const dataConsultaLuxonAuxiliar = DateTime.fromFormat(consulta.getDataConsulta(), 'dd/MM/yyyy');

            if (dataConsultaLuxonAuxiliar.equals(dataConsultaLuxon)) {
                const consultaInicio = this.converterParaMinutos(consulta.getHoraInicio());
                const consultaFim = this.converterParaMinutos(consulta.getHoraFim());
                return (
                    (inicio >= consultaInicio && inicio < consultaFim) ||
                    (fim > consultaInicio && fim <= consultaFim) ||
                    (inicio <= consultaInicio && fim >= consultaFim)
                );
            }
            return false;
        });
    }

    /**
     * Converte um horário no formato HHMM para o número total de minutos.
     * @param {string} horario - O horário no formato 'HHMM'.
     * @returns {number} - O horário convertido em minutos totais.
     */
    static converterParaMinutos(horario) {
        const horas = parseInt(horario.slice(0, 2), 10);
        const minutos = parseInt(horario.slice(2), 10);
        return horas * 60 + minutos;
    }

    /**
     * Verifica se o valor de minutos é um múltiplo de 15.
     * @param {number} minutos - O valor em minutos.
     * @returns {boolean} - Retorna `true` se o valor for múltiplo de 15, ou `false` caso contrário.
     */
    static ehIntervaloDe15Minutos(minutos) {
        return minutos % 15 === 0;
    }
}
