import PacienteRepository from '../repositories/PacienteRepository.js';
import ConsultaRepository from '../repositories/ConsultaRepository.js';
import sequelize from '../config/database.js';

async function testarPacienteRepository() {
  try {
    console.log('=== Testando PacienteRepository ===');

    // Criar paciente
    const paciente = await PacienteRepository.criar({
      nome: 'João Silva',
      cpf: '12345678901',
      data_nascimento: '2000-01-01',
    });
    console.log('Paciente criado:', paciente);

    // Buscar paciente pelo CPF
    const pacienteBuscado = await PacienteRepository.buscarPorCPF('12345678901');
    console.log('Paciente buscado:', pacienteBuscado);

    // Listar pacientes
    const pacientes = await PacienteRepository.listar();
    console.log('Lista de pacientes:', pacientes);

    // Excluir paciente
    await PacienteRepository.excluir('12345678901');
    console.log('Paciente excluído com sucesso.');
  } catch (error) {
    console.error('Erro no PacienteRepository:', error.message);
  }
}

async function testarConsultaRepository() {
  try {
    console.log('=== Testando ConsultaRepository ===');

    // Criar paciente (necessário para associar consulta)
    const paciente = await PacienteRepository.criar({
      nome: 'Maria Oliveira',
      cpf: '98765432100',
      data_nascimento: '1990-05-15',
    });

    // Criar consulta
    const consulta = await ConsultaRepository.criarConsulta({
      pacienteId: paciente.id,
      dataConsulta: '2024-12-15',
      horaInicio: '1400',
      horaFim: '1430',
    });
    console.log('Consulta criada:', consulta);

    // Tentar criar consulta com sobreposição (deve falhar)
    try {
      await ConsultaRepository.criarConsulta({
        pacienteId: paciente.id,
        dataConsulta: '2024-12-15',
        horaInicio: '1415',
        horaFim: '1445',
      });
    } catch (error) {
      console.error('Erro esperado (sobreposição):', error.message);
    }

    // Listar consultas
    const consultas = await ConsultaRepository.listar();
    console.log('Lista de consultas:', consultas);

    // Excluir consulta
    await ConsultaRepository.excluir(consulta.id);
    console.log('Consulta excluída com sucesso.');
  } catch (error) {
    console.error('Erro no ConsultaRepository:', error.message);
  }
}

async function testarTudo() {
  await sequelize.sync({ force: true }); // Sincronizar banco
  console.log('Banco de dados sincronizado.');

  await testarPacienteRepository();
  await testarConsultaRepository();

  await sequelize.close(); // Fechar conexão com o banco
}

testarTudo();
