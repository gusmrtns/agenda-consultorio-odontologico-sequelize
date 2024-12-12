import PacienteController from '../controllers/PacienteController.js';
import sequelize from '../config/database.js';
import ConsultaController from '../controllers/ConsultaController.js';
import associateModels from '../models/Association.js';

associateModels();

(async () => {
  try {
    console.log('=== Iniciando Testes de Paciente ===');
    await sequelize.sync({ force: true }); // Sincronizar banco de dados
    console.log('Banco de dados sincronizado.');

    // Teste: Cadastrar Pacientes com dados mockados
    console.log('\n=== Teste: Cadastro de Pacientes ===');
    const pacientesMock = [
      { nome: 'João Silva', cpf: '12345678909', data_nascimento: '2005-12-01' },
      { nome: 'Maria Oliveira', cpf: '54090137004', data_nascimento: '2000-05-15' },
      { nome: 'Carlos Mendes', cpf: '46754083034', data_nascimento: '2010-07-30' }, // Menor de 13 anos
    ];

    for (const paciente of pacientesMock) {
      try {
        await PacienteController.cadastrarPacienteDireto(paciente); // Método direto
      } catch (error) {
        console.error(`Erro ao cadastrar paciente ${paciente.nome}: ${error.message}`);
      }
    }

    // Teste: Listar Pacientes
    console.log('\n=== Teste: Listar Pacientes ===');
    await PacienteController.listarPacientes();

    // Teste: Listar Pacientes Ordenados por CPF
    console.log('\n=== Teste: Listar Pacientes Ordenados por CPF ===');
    await PacienteController.listarPacientesOrdenadosPorCPF();

    // Teste: Listar Pacientes Ordenados por Nome
    console.log('\n=== Teste: Listar Pacientes Ordenados por Nome ===');
    await PacienteController.listarPacientesOrdenadosPorNome();

    // Teste: Excluir Paciente
    console.log('\n=== Teste: Excluir Paciente ===');
    try {
      console.log('Tentando excluir paciente com CPF 54090137004...');
      await PacienteController.excluirPacienteDireto('54090137004');
    } catch (error) {
      console.error(`Erro ao excluir paciente: ${error.message}`);
    }

    // Teste: Excluir Paciente com Consulta Futura
    console.log('\n=== Teste: Excluir Paciente com Consulta Futura ===');
    console.log('Associando consulta futura ao paciente com CPF 46754083034...');
    await ConsultaController.agendarConsulta();
    try {
      await PacienteController.excluirPacienteDireto('46754083034');
    } catch (error) {
      console.error(`Erro ao excluir paciente com consulta futura: ${error.message}`);
    }

    console.log('\n=== Testes Concluídos ===');
    await sequelize.close();
  } catch (error) {
    console.error('Erro nos testes:', error.message);
  }
})();
