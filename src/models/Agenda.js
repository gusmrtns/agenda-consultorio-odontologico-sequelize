/**
 * Representa a agenda de um consultório odontológico.
 * @class
 */
class Agenda {
    #consultas = [];
    #pacientes = [];

    /**
     * Construtor da classe Agenda, implementando o padrão Singleton.
     * Se uma instância já existir, ela será retornada.
     */
    constructor() {
        if (Agenda.instance) {
            return Agenda.instance;
        }
        Agenda.instance = this;
    }

    /**
     * Adiciona um paciente à lista de pacientes na agenda.
     * @param {Paciente} paciente - O paciente a ser adicionado.
     */
    adicionarPaciente(paciente) {
        this.#pacientes.push(paciente);
    }

    /**
     * Remove um paciente da agenda. Verifica se o paciente tem consultas futuras.
     * @param {string} cpf - O CPF do paciente a ser removido.
     * @throws {Error} Caso o paciente tenha consultas futuras ou não seja encontrado.
     */
    removerPaciente(cpf) {
        const consultas = this.#consultas.filter(consulta => consulta.getPaciente().getCPF() === cpf);
        if (consultas.length > 0) {
            throw new Error('Paciente possui consultas agendadas.');
        }

        const index = this.#pacientes.findIndex(paciente => paciente.getCPF() === cpf);
        if (index === -1) {
            throw new Error('Paciente não encontrado na agenda.');
        }
        this.#pacientes.splice(index, 1);  // Remove paciente
    }

    /**
     * Retorna a lista de pacientes.
     * @returns {Paciente[]} - A lista de pacientes.
     */
    getPacientes() {
        return this.#pacientes || [];
    }

    /**
     * Adiciona uma consulta à agenda.
     * @param {Consulta} consulta - A consulta a ser adicionada.
     */
    adicionarConsulta(consulta) {
        this.#consultas.push(consulta);
    }

    /**
     * Retorna a lista de consultas agendadas.
     * @returns {Consulta[]} - A lista de consultas.
     */
    getConsultas() {
        return this.#consultas;
    }

    /**
     * Cancela uma consulta, verificando se é uma consulta futura.
     * @param {string} cpf - O CPF do paciente.
     * @param {string} dataConsulta - A data da consulta a ser cancelada.
     * @param {string} horaInicio - A hora de início da consulta a ser cancelada.
     * @returns {boolean} - Retorna `true` se a consulta foi cancelada, `false` caso contrário.
     * @throws {Error} Se a consulta for passada.
     */
    cancelarConsulta(cpf, dataConsulta, horaInicio) {
        if (DateTime.fromFormat(dataConsulta, 'dd/MM/yyyy') < DateTime.now()) {
            throw new Error('Não é possível cancelar consultas passadas.');
        }

        const index = this.#consultas.findIndex(
            consulta => consulta.getPaciente().getCPF() === cpf && consulta.getDataConsulta() === dataConsulta && consulta.getHoraInicio() === horaInicio
        );
        if (index === -1) return false;
        this.#consultas.splice(index, 1);
        return true;
    }

    /**
     * Retorna a instância única da agenda (Singleton).
     * @returns {Agenda} - A instância da agenda.
     */
    static getInstance() {
        if (!Agenda.instance) {
            Agenda.instance = new Agenda();
        }
        return Agenda.instance;
    }
}

export default Agenda;
