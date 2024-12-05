import prompt from 'prompt-sync';

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
        const dataConsulta = input('Digite a data da consulta (DD/MM/AAAA): ');
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
        const dataConsulta = input('Digite a data da consulta (DD/MM/AAAA): ');
        const horaInicio = input('Digite a hora de início da consulta (HHMM): ');
        return { cpf, dataConsulta, horaInicio };
    },

    /**
     * Exibe a lista de consultas agendadas.
     * Para cada consulta, exibe as informações no formato definido pelo método `toString` da classe `Consulta`.
     * @param {Array<Consulta>} consultas - Array de instâncias de consulta.
     * @returns {void}
     */
    listarAgenda(consultas) {
        console.log('Agenda');
        consultas.forEach(consulta => {
            console.log(consulta.toString());
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
    }
};
