import prompt from 'prompt-sync';
import Agenda from '../models/Agenda.js';
import { DateTime } from 'luxon';

const input = prompt();

/**
 * View responsável pela interação com o usuário sobre os pacientes.
 * @class
 */
export default {

    /**
     * Solicita os dados necessários para cadastrar um novo paciente.
     * O usuário é solicitado a inserir o CPF, nome e data de nascimento do paciente.
     * @async
     * @returns {Promise<Object>} Retorna um objeto com as propriedades `cpf`, `nome`, e `dataNascimento`.
     */
    async obterDadosPaciente() {
        console.log('Cadastro de Paciente');
        const cpf = input('Digite o CPF: ');
        const nome = input('Digite o nome: ');
        const dataNascimento = input('Digite a data de nascimento (DD/MM/AAAA): ');
        return { cpf, nome, dataNascimento };
    },

    /**
     * Solicita o CPF de um paciente para excluir.
     * @async
     * @returns {Promise<string>} Retorna o CPF do paciente a ser excluído.
     */
    async obterCpfPaciente() {
        console.log('Excluir Paciente');
        return input('Digite o CPF do paciente a ser excluído: ');
    },

    /**
     * Exibe a lista de pacientes com seus dados e consultas futuras.
     * Para cada paciente, exibe o CPF, nome, data de nascimento, idade e as consultas futuras agendadas.
     * Caso o paciente não tenha consultas futuras, exibe a mensagem "Sem consultas futuras."
     * @param {Array<Paciente>} pacientes - Array de instâncias de `Paciente`.
     * @returns {void}
     */
    listarPacientes(pacientes) {
        console.log('------------------------------------------------------------');
        console.log('CPF         Nome                        Dt.Nasc.  Idade');
        console.log('------------------------------------------------------------');
    
        pacientes.forEach(paciente => {
            const idade = this.calcularIdade(paciente.getDataNascimento());
            console.log(`${paciente.getCPF()} ${paciente.getNome()} ${paciente.getDataNascimento()} ${idade}`);
            
            // Exibindo as consultas futuras
            const consultasFuturas = Agenda.getInstance().getConsultas().filter(consulta => 
                consulta.getPaciente().getCPF() === paciente.getCPF() && 
                DateTime.fromFormat(consulta.getDataConsulta(), 'dd/MM/yyyy') > DateTime.now()
            );
            
            if (consultasFuturas.length > 0) {
                consultasFuturas.forEach(consulta => {
                    console.log(`Agendado para: ${consulta.getDataConsulta()} ${consulta.getHoraInicio()} às ${consulta.getHoraFim()}`);
                });
            } else {
                console.log('Sem consultas futuras.');
            }
        });
    },

    /**
     * Calcula a idade de um paciente com base na sua data de nascimento.
     * @param {string} dataNascimento - A data de nascimento do paciente no formato 'DD/MM/AAAA'.
     * @returns {number} Retorna a idade do paciente.
     */
    calcularIdade(dataNascimento) {
        const hoje = DateTime.local();
        const nascimento = DateTime.fromFormat(dataNascimento, 'dd/MM/yyyy');
        return hoje.year - nascimento.year - (hoje < nascimento.plus({ years: hoje.year - nascimento.year }) ? 1 : 0);
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
