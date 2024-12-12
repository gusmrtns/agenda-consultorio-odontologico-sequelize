import ConsultaController from '../controllers/ConsultaController.js';
import sequelize from '../config/database.js';
import PacienteRepository from '../repositories/PacienteRepository.js';
import ConsultaRepository from '../repositories/ConsultaRepository.js';
import associateModels from '../models/Association.js';
import Paciente from '../models/Paciente.js';
import Consulta from '../models/Consulta.js';

associateModels();

(async () => {
  try {
    console.log('=== Testando Listagem de Consultas por Período ===');

    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado.');

    // Mock de pacientes e consultas
    const pacientes = [
      { nome: 'João Silva', cpf: '12345678909', data_nascimento: '2000-01-01' },
      { nome: 'Maria Oliveira', cpf: '54090137004', data_nascimento: '1985-05-15' },
    ];

    const consultas = [
      { pacienteCpf: '12345678909', dataConsulta: '2024-12-15', horaInicio: '0900', horaFim: '0930' },
      { pacienteCpf: '54090137004', dataConsulta: '2024-12-12', horaInicio: '1400', horaFim: '1430' },
      { pacienteCpf: '12345678909', dataConsulta: '2024-12-14', horaInicio: '1000', horaFim: '1030' },
    ];

    // Criar pacientes e consultas
    for (const paciente of pacientes) {
      await PacienteRepository.criar(paciente);
    }

    for (const consulta of consultas) {
      const paciente = await PacienteRepository.buscarPorCPF(consulta.pacienteCpf);
      await ConsultaRepository.criarConsulta({
        pacienteId: paciente.id,
        dataConsulta: consulta.dataConsulta,
        horaInicio: consulta.horaInicio,
        horaFim: consulta.horaFim,
      });
    }

    // Testar listagem por período
    const dataInicio = '12/12/2024';
    const dataFim = '13/12/2024';
    console.log(`Listando consultas de ${dataInicio} a ${dataFim}...`);
    await ConsultaController.listarPorPeriodo();

    console.log('Testes concluídos!');
    await sequelize.close();
  } catch (error) {
    console.error('Erro nos testes:', error.message);
  }
})();
