import sequelize from './src/config/database.js';
import PacienteController from './src/controllers/PacienteController.js';
import ConsultaController from './src/controllers/ConsultaController.js';
import promptSync from 'prompt-sync';
import associateModels from './src/models/Association.js';

associateModels();

const input = promptSync();

async function exibirMenuPrincipal() {
    try {
        console.log(`
    ================================
    Sistema de Gerenciamento de Consultório
    ================================
    1 - Cadastro de Pacientes
    2 - Agenda de Consultas
    3 - Sair
    `);

        const opcao = input('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                await exibirMenuCadastroPaciente();
                break;
            case '2':
                await exibirMenuAgenda();
                break;
            case '3':
                console.log('Saindo...');
                await sequelize.close(); // Fechar conexão com o banco
                process.exit();
            default:
                console.log('Opção inválida, tente novamente.');
                await exibirMenuPrincipal();
        }
    } catch (error) {
        console.error('Erro no menu principal:', error.message);
        await exibirMenuPrincipal();
    }
}

async function exibirMenuCadastroPaciente() {
    try {
        console.log(`
    ================================
    Cadastro de Pacientes
    ================================
    1 - Cadastrar novo paciente
    2 - Excluir paciente
    3 - Listar pacientes (ordenado por CPF)
    4 - Listar pacientes (ordenado por nome)
    5 - Voltar p/ menu principal
        `);

        const opcao = input('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                await PacienteController.cadastrarPaciente();
                break;
            case '2':
                await PacienteController.excluirPaciente();
                break;
            case '3':
                await PacienteController.listarPacientesOrdenadosPorCPF();
                break;
            case '4':
                await PacienteController.listarPacientesOrdenadosPorNome();
                break;
            case '5':
                return await exibirMenuPrincipal();
            default:
                console.log('Opção inválida, tente novamente.');
        }

        await exibirMenuCadastroPaciente();
    } catch (error) {
        console.error('Erro no menu de cadastro de pacientes:', error.message);
        await exibirMenuCadastroPaciente();
    }
}

async function exibirMenuAgenda() {
    try {
        console.log(`
    ================================
    Agenda de Consultas
    ================================
    1 - Agendar consulta
    2 - Cancelar consulta
    3 - Listar toda a agenda
    4 - Listar consultas por período
    5 - Voltar p/ menu principal
        `);

        const opcao = input('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                await ConsultaController.agendarConsulta();
                break;
            case '2':
                await ConsultaController.cancelarConsulta();
                break;
            case '3':
                await ConsultaController.listarAgenda();
                break;
            case '4':
                await ConsultaController.listarPorPeriodo();
                break;
            case '5':
                return await exibirMenuPrincipal();
            default:
                console.log('Opção inválida, tente novamente.');
        }

        await exibirMenuAgenda();
    } catch (error) {
        console.error('Erro no menu de agenda:', error.message);
        await exibirMenuAgenda();
    }
}

async function iniciarApp() {
    try {
        console.log('Verificando conexão com o banco...');
        await sequelize.authenticate(); // Verificar conexão com o banco
        console.log('Banco de dados conectado.');

        console.log('Bem-vindo ao sistema de gerenciamento de consultório!');
        await exibirMenuPrincipal();
    } catch (error) {
        console.error('Erro ao iniciar o aplicativo:', error.message);
    }
}

iniciarApp();
