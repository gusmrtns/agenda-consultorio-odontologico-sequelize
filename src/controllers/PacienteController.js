import PacienteRepository from '../repositories/PacienteRepository.js';
import PacienteView from '../views/PacienteView.js';
import { DateTime } from 'luxon';


class PacienteController {
  /**
   * Cadastra um novo paciente.
   * Solicita os dados do paciente, valida e delega ao repositório.
   * @async
   * @returns {Promise<void>}
   */
  static async cadastrarPaciente() {
    try {
      const { cpf, nome, dataNascimento } = await PacienteView.obterDadosPaciente();

      const paciente = await PacienteRepository.criar({
        cpf,
        nome,
        data_nascimento: dataNascimento,
      });

      PacienteView.mostrarMensagem(`Paciente ${paciente.nome} cadastrado com sucesso!`);
    } catch (error) {
      PacienteView.mostrarErro(error.message);
    }
  }

    /**
   * Cadastra um novo paciente diretamente (para testes).
   * @param {Object} pacienteData - Dados do paciente.
   * @async
   * @returns {Promise<void>}
   */
    static async cadastrarPacienteDireto(pacienteData) {
      try {
        const paciente = await PacienteRepository.criar(pacienteData);
        PacienteView.mostrarMensagem(`Paciente ${paciente.nome} cadastrado com sucesso!`);
      } catch (error) {
        PacienteView.mostrarErro(error.message);
      }
    }
  

  /**
   * Exclui um paciente.
   * Solicita o CPF, valida exclusão e delega ao repositório.
   * @async
   * @returns {Promise<void>}
   */
  static async excluirPaciente() {
    try {
      const cpf = await PacienteView.obterCpfPaciente();

      await PacienteRepository.excluir(cpf);

      PacienteView.mostrarMensagem('Paciente excluído com sucesso.');
    } catch (error) {
      PacienteView.mostrarErro(error.message);
    }
  }

    /**
   * Exclui um paciente diretamente (para testes).
   * @param {string} cpf - CPF do paciente.
   * @async
   * @returns {Promise<void>}
   */
    static async excluirPacienteDireto(cpf) {
      try {
        await PacienteRepository.excluir(cpf);
        PacienteView.mostrarMensagem('Paciente excluído com sucesso.');
      } catch (error) {
        PacienteView.mostrarErro(error.message);
      }
    }
  

  /**
   * Lista todos os pacientes.
   * Solicita a listagem ao repositório e exibe na view.
   * @async
   * @returns {Promise<void>}
   */
  static async listarPacientes() {
    try {
      const pacientes = await PacienteRepository.listar();
      PacienteView.listarPacientes(pacientes);
    } catch (error) {
      console.log(error);
      PacienteView.mostrarErro('Erro ao listar pacientes.');
    }
  }
  /**
   * Lista todos os pacientes ordenados por CPF.
   * @async
   * @returns {Promise<void>}
   */
  static async listarPacientesOrdenadosPorCPF() {
    try {
      const pacientes = await PacienteRepository.listar();
      const pacientesOrdenados = pacientes.sort((a, b) => a.cpf.localeCompare(b.cpf));
      PacienteView.listarPacientes(pacientesOrdenados);
    } catch (error) {
      PacienteView.mostrarErro('Erro ao listar pacientes por CPF.');
    }
  }

  /**
   * Lista todos os pacientes ordenados por nome.
   * @async
   * @returns {Promise<void>}
   */
  static async listarPacientesOrdenadosPorNome() {
    try {
      const pacientes = await PacienteRepository.listar();
      const pacientesOrdenados = pacientes.sort((a, b) => a.nome.localeCompare(b.nome));
      PacienteView.listarPacientes(pacientesOrdenados);
    } catch (error) {
      PacienteView.mostrarErro('Erro ao listar pacientes por nome.');
    }
  }
}

export default PacienteController;
