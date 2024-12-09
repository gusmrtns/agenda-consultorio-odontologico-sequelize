import sequelize from './src/config/database.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar-se ao banco de dados:', error.message);
  }
}

testConnection();
