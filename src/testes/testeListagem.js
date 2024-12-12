import ConsultaRepository from '../repositories/ConsultaRepository.js';
import associateModels from '../models/Association.js';

associateModels();


(async () => {
    console.log('=== Testando Listagem Geral Ordenada ===');

    try {
        console.log('Listando todas as consultas...');
        const consultas = await ConsultaRepository.listar();
        consultas.forEach(consulta => {
            console.log(`Paciente: ${consulta.paciente.nome || 'Desconhecido'}`);
            console.log(`Data: ${consulta.dataConsulta}`);
            console.log(`Horário: ${consulta.horaInicio} - ${consulta.horaFim}`);
            console.log('----------------------------------------');
        });
    } catch (error) {
        console.error('Erro ao listar consultas:', error.message);
    }
})();
