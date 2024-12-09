import PacienteRepository from '../repositories/PacienteRepository.js';
import PacienteView from '../views/PacienteView.js';

export class PacienteController {
  /**
   * Cadastra um novo paciente no banco de dados.
   * Solicita os dados do paciente, valida e o adiciona ao banco.
   * @async
   * @returns {Promise<void>}
   */
  static async cadastrarPaciente() {
    try {
      const { cpf, nome, dataNascimento } = await PacienteView.obterDadosPaciente();

      // Validação de CPF e outras regras já são feitas no Repository ou Factory
      const paciente = await PacienteRepository.criar({ cpf, nome, data_nascimento: dataNascimento });
      PacienteView.mostrarMensagem(`Paciente ${paciente.nome} cadastrado com sucesso!`);
    } catch (error) {
      PacienteView.mostrarErro(error.message);
    }
  }

  /**
   * Exclui um paciente do banco de dados.
   * Solicita o CPF do paciente e tenta excluí-lo.
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
