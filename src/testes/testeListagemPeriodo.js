import ConsultaController from '../controllers/ConsultaController.js';
import sequelize from '../config/database.js';
import PacienteRepository from '../repositories/PacienteRepository.js';
import ConsultaRepository from '../repositories/ConsultaRepository.js';

(async () => {
  try {
    await sequelize.sync({ force: true }); // Sincronizar o banco e resetar os dados
    console.log('Banco de dados sincronizado.');

    // Criar paciente mockado para associar às consultas
    const paciente = await PacienteRepository.criar({
      nome: 'Teste Paciente',
      cpf: '11122233344',
      data_nascimento: '1990-01-01',
    });

    console.log('Paciente criado:', paciente);

    // Criar consultas mockadas
    const consultasMockadas = [
      { pacienteId: paciente.id, dataConsulta: '2024-12-10', horaInicio: '0900', horaFim: '0930' },
      { pacienteId: paciente.id, dataConsulta: '2024-12-11', horaInicio: '1000', horaFim: '1030' },
      { pacienteId: paciente.id, dataConsulta: '2024-12-12', horaInicio: '1100', horaFim: '1130' },
    ];

    for (const consulta of consultasMockadas) {
      await ConsultaRepository.criarConsulta(consulta);
    }

    console.log('Consultas mockadas criadas com sucesso.');

    console.log('=== Testando Listagem de Consultas por Período ===');
    await ConsultaController.listarPorPeriodo();

    await sequelize.close(); // Fechar conexão com o banco
    console.log('Testes concluídos!');
  } catch (error) {
    console.error('Erro nos testes:', error.message);
  }
})();
