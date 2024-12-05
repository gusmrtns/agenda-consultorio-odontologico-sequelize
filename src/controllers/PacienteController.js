import { PacienteFactory } from '../factories/PacienteFactory.js';
import Agenda from '../models/Agenda.js';
import PacienteView from '../views/PacienteView.js';

/**
 * Controlador responsável pelas operações relacionadas aos pacientes.
 * @class
 */
export class PacienteController {
    
    /**
     * Cadastra um novo paciente na agenda.
     * Solicita os dados do paciente, valida e o adiciona à agenda.
     * @async
     * @returns {Promise<void>} Retorna uma promessa.
     */
    static async cadastrarPaciente() {
        const { cpf, nome, dataNascimento } = await PacienteView.obterDadosPaciente();
        const resultado = PacienteFactory.criarPaciente(cpf, nome, dataNascimento);

        if (!resultado.valido) {
            PacienteView.mostrarErro(resultado.erro);
        } else {
            PacienteView.mostrarMensagem(`Paciente ${resultado.paciente.getNome()} cadastrado com sucesso!`);
            Agenda.getInstance().adicionarPaciente(resultado.paciente); // Adiciona paciente à agenda
        }
    }

    /**
     * Exclui um paciente da agenda.
     * Solicita o CPF do paciente e o remove da agenda se não houver consultas futuras.
     * @async
     * @returns {Promise<void>} Retorna uma promessa.
     */
    static async excluirPaciente() {
        const cpf = await PacienteView.obterCpfPaciente();

        try {
            // Verifica se o paciente existe na agenda e remove
            Agenda.getInstance().removerPaciente(cpf);
            PacienteView.mostrarMensagem('Paciente excluído com sucesso.');
        } catch (erro) {
            PacienteView.mostrarErro(erro.message); // Caso o paciente não seja encontrado
        }
    }

    /**
     * Lista os pacientes ordenados por nome.
     * Exibe a lista de pacientes, ordenada alfabeticamente por nome.
     * @returns {void}
     */
    static listarPacientesOrdenadosPorNome() {
        try {
            const pacientes = Agenda.getInstance().getPacientes();
    
            if (!Array.isArray(pacientes) || pacientes.length === 0) {
                console.log('Nenhum paciente encontrado.');
                return;
            }
    
            const pacientesOrdenados = pacientes.sort((a, b) => a.getNome().localeCompare(b.getNome()));
            PacienteView.listarPacientes(pacientesOrdenados);
        } catch (error) {
            console.error('Erro ao listar pacientes por nome:', error.message);
        }
    }
    
    /**
     * Lista os pacientes ordenados por CPF.
     * Exibe a lista de pacientes, ordenada em ordem crescente de CPF.
     * @returns {void}
     */
    static listarPacientesOrdenadosPorCPF() {
        try {
            const pacientes = Agenda.getInstance().getPacientes();
    
            if (!Array.isArray(pacientes) || pacientes.length === 0) {
                console.log('Nenhum paciente encontrado.');
                return;
            }
    
            const pacientesOrdenados = pacientes.sort((a, b) => a.getCPF().localeCompare(b.getCPF()));
            PacienteView.listarPacientes(pacientesOrdenados);
        } catch (error) {
            console.error('Erro ao listar pacientes por CPF:', error.message);
        }
    }
}
