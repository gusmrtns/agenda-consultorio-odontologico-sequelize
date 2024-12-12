import prompt from 'prompt-sync';
import { DateTime } from 'luxon';

const input = prompt();

/**
 * View responsável pela interação com o usuário sobre as consultas.
 * @class
 */
export default {

    /**
     * Solicita os dados necessários para agendar uma consulta.
     * O usuário é solicitado a inserir o CPF do paciente, data da consulta, hora de início e hora de término.
     * @async
     * @returns {Promise<Object>} Retorna um objeto com as propriedades `cpf`, `dataConsulta`, `horaInicio`, e `horaFim`.
     */
    async obterDadosConsulta() {
        console.log('Agendar Consulta');
        const cpf = input('Digite o CPF do paciente: ');
        const dataConsulta = input('Digite a data da consulta (AAAA/MM/DD): ');
        const horaInicio = input('Digite a hora de início (HHMM): ');
        const horaFim = input('Digite a hora de fim (HHMM): ');
        return { cpf, dataConsulta, horaInicio, horaFim };
    },

    /**
     * Solicita os dados necessários para cancelar uma consulta.
     * O usuário é solicitado a inserir o CPF do paciente, data da consulta e hora de início.
     * @async
     * @returns {Promise<Object>} Retorna um objeto com as propriedades `cpf`, `dataConsulta`, e `horaInicio`.
     */
    async obterDadosCancelamento() {
        console.log('Cancelar Consulta');
        const cpf = input('Digite o CPF do paciente: ');
        const dataConsulta = input('Digite a data da consulta (AAAA/MM/DD): ');
        const horaInicio = input('Digite a hora de início da consulta (HHMM): ');
        return { cpf, dataConsulta, horaInicio };
    },

    /**
 * Exibe a lista de consultas agendadas.
 * Para cada consulta, exibe as informações formatadas para o usuário.
 * @param {Array<Object>} consultas - Array de objetos representando consultas.
 * @returns {void}
 */
    listarAgenda(consultas) {
        console.log('Agenda de Consultas:');
        if (!consultas || consultas.length === 0) {
          console.log('Nenhuma consulta encontrada.');
          return;
        }
      
        consultas.forEach(consulta => {
          const { paciente, dataConsulta, horaInicio, horaFim } = consulta;
      
          // Tratamento de campos antes de exibição
          const nomePaciente = paciente?.nome || 'Paciente não identificado';
          const dataFormatada = DateTime.fromISO(dataConsulta).toFormat('dd/MM/yyyy');
          const horarioInicio = `${horaInicio.slice(0, 2)}:${horaInicio.slice(2)}`;
          const horarioFim = `${horaFim.slice(0, 2)}:${horaFim.slice(2)}`;
      
          // Exibição formatada
          console.log(`Paciente: ${nomePaciente}`);
          console.log(`Data: ${dataFormatada}`);
          console.log(`Horário: ${horarioInicio} - ${horarioFim}`);
          console.log('----------------------------------------');
        });
      },


    /**
     * Exibe uma mensagem de erro para o usuário.
     * @param {string} erro - A mensagem de erro a ser exibida.
     * @returns {void}
     */
    mostrarErro(erro) {
        console.log(`Erro: ${erro}`);
    },

    /**
     * Exibe uma mensagem de sucesso ou outra informação para o usuário.
     * @param {string} mensagem - A mensagem a ser exibida.
     * @returns {void}
     */
    mostrarMensagem(mensagem) {
        console.log(mensagem);
    },

   /**
   * Solicita ao usuário um intervalo de datas.
   * @async
   * @returns {Promise<Object>} Objeto contendo dataInicio e dataFim no formato DD/MM/YYYY.
   */
  async obterPeriodo() {
    console.log('Listar consultas por período');
    const dataInicio = input('Digite a data inicial (DD/MM/YYYY): ');
    const dataFim = input('Digite a data final (DD/MM/YYYY): ');
    return { dataInicio, dataFim };
  },
};
