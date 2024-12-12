import PacienteDAO from '../daos/PacienteDAO.js';
import ConsultaDAO from '../daos/ConsultaDAO.js';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

class PacienteRepository {
  /**
   * Cria um paciente após validações.
   * @param {Object} pacienteData - Dados do paciente.
   * @returns {Promise<Paciente>}
   * @throws {Error} Caso alguma validação falhe.
   */
  async criar(pacienteData) {
    const { cpf, nome, data_nascimento } = pacienteData;

    // Validação: CPF deve ser único
    const existente = await PacienteDAO.buscarPorCPF(cpf);
    if (existente) {
      throw new Error('Já existe um paciente com este CPF.');
    }

    // Validação: CPF deve ser válido
    if (!this._validarCPF(cpf)) {
      throw new Error('CPF inválido.');
    }

    // Validação: Nome deve ter pelo menos 5 caracteres
    if (nome.trim().length < 5) {
      throw new Error('O nome deve ter pelo menos 5 caracteres.');
    }

    // Validação: Idade mínima de 13 anos
    const dataNascimentoLuxon = DateTime.fromISO(data_nascimento);
    if (!dataNascimentoLuxon.isValid || !this._validarIdade(dataNascimentoLuxon)) {
      throw new Error('O paciente deve ter pelo menos 13 anos.');
    }

    // Criar o paciente no banco de dados
    return await PacienteDAO.criar(pacienteData);
  }

  /**
   * Exclui um paciente pelo CPF.
   * @param {string} cpf - CPF do paciente.
   * @returns {Promise<void>}
   * @throws {Error} Caso o paciente tenha consultas futuras.
   */
  async excluir(cpf) {
    const paciente = await PacienteDAO.buscarPorCPF(cpf);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    // Verificar consultas futuras
    const consultasFuturas = await ConsultaDAO.listar({
      where: {
        pacienteId: paciente.id,
        dataConsulta: {
          [Op.gte]: DateTime.local().toISODate(),
        },
      },
    });

    if (consultasFuturas.length > 0) {
      throw new Error('Paciente possui consultas futuras e não pode ser excluído.');
    }

    // Excluir o paciente
    await PacienteDAO.excluir(cpf);
  }

  async buscarPorCPF(cpf) {
    return await PacienteDAO.buscarPorCPF(cpf);
  }

  async listar() {
    return await PacienteDAO.listar();
  }

  /**
   * Verifica se o CPF é válido (algoritmo de validação).
   * @param {string} cpf - CPF a ser validado.
   * @returns {boolean} Retorna `true` se for válido, caso contrário `false`.
   */
  _validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    return resto === parseInt(cpf.substring(10, 11));
  }

  /**
   * Verifica se o paciente possui a idade mínima.
   * @param {DateTime} dataNascimento - Data de nascimento do paciente.
   * @returns {boolean} Retorna `true` se a idade for 13 anos ou mais.
   */
  _validarIdade(dataNascimento) {
    const hoje = DateTime.local();
    const idade = hoje.diff(dataNascimento, 'years').years;
    return idade >= 13;
  }
}

export default new PacienteRepository();
