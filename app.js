import { PacienteController } from './src/controllers/PacienteController.js';
import { ConsultaController } from './src/controllers/ConsultaController.js';
import promptSync from 'prompt-sync';

const input = promptSync();

async function exibirMenuPrincipal() {
    console.log(`
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
            process.exit();
            break;
        default:
            console.log('Opção inválida, tente novamente.');
            await exibirMenuPrincipal();
    }
}

async function exibirMenuCadastroPaciente() {
    console.log(`
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
            await exibirMenuPrincipal();
            return;
        default:
            console.log('Opção inválida, tente novamente.');
    }

    await exibirMenuCadastroPaciente(); // Volta para o menu de cadastro de pacientes
}

async function exibirMenuAgenda() {
    console.log(`
    1 - Agendar consulta
    2 - Cancelar consulta
    3 - Listar agenda
    4 - Voltar
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
            ConsultaController.listarAgenda();
            break;
        case '4':
            await exibirMenuPrincipal();
            return;
        default:
            console.log('Opção inválida, tente novamente.');
    }

    await exibirMenuAgenda(); // Volta para o menu da agenda
}

async function iniciarApp() {
    console.log('Bem-vindo ao sistema de gerenciamento de consultório!');
    await exibirMenuPrincipal();
}

iniciarApp();
