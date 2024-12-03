# Formação Back-end - Node.js/Express - Desafio #3.1: Persistência dos Dados da Clínica Odontológica

## Desafio

**Objetivo**: Implementar a persistência dos dados na aplicação desenvolvida no **Desafio #1.2**. A persistência deve ser implementada utilizando o **Sequelize** como ORM (Object-Relational Mapping) e o **PostgreSQL** como banco de dados.

## Instruções

- **Desenvolvimento individual**: O desafio deve ser realizado de forma independente.
- **Data limite de entrega**: 12/12/2024 (quarta-feira).
- **Versionamento**: O projeto deve ser versionado e disponibilizado no **GitHub**.
- **Fork do repositório**: O repositório do [desafio#1.2](https://github.com/gusmrtns/agenda-consultorio-odontologico) #1.2 deve ser **clonado** (fork) para implementação do desafio #3.1.

## Requisitos

1. **Uso do Sequelize**: Para o mapeamento objeto-relacional (ORM), é obrigatório o uso do **Sequelize**.
2. **Banco de Dados**: O banco de dados utilizado deve ser o **PostgreSQL**.
   - Pode ser instalado localmente ou acessado via **Docker**.
3. **Refatoração (opcional)**: O código do Desafio #1.2 pode ser refatorado, caso seja necessário ou relevante para aprimorar a estrutura da aplicação.
4. **Erros no acesso ao SGBD**: Devem ser tratadas e apresentadas mensagens de erro apropriadas.

## Instalação e Configuração

### 1. Clonando o Repositório

Faça o fork do repositório do **Desafio #1.2** e clone o seu repositório para a sua máquina local.

```bash
git clone https://github.com/seu-usuario/repo-do-desafio-3.1.git
```

### 2. Configurando o Banco de Dados

#### Usando PostgreSQL Localmente

- Baixe e instale o PostgreSQL em sua máquina a partir do [site oficial](https://www.postgresql.org/download/).
- Crie um banco de dados para a aplicação:

```sql
CREATE DATABASE clinica_odontologica;
```

#### Usando PostgreSQL com Docker

Alternativamente, você pode rodar o PostgreSQL em um container Docker com o seguinte comando:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=senha -d -p 5432:5432 postgres
```

- Configure o Sequelize com os dados de acesso ao banco de dados. (Configuração do arquivo `.env` ou diretamente no arquivo de configuração do Sequelize).

### 3. Instalando Dependências

Dentro do diretório do projeto, instale as dependências do projeto:

```bash
npm install
```

### 4. Configurando Sequelize

Configure a conexão do **Sequelize** com o banco de dados PostgreSQL no arquivo de configuração do Sequelize, indicando o nome do banco, usuário, senha e host:

```js
// exemplo de configuração
module.exports = {
  username: "usuario",
  password: "senha",
  database: "clinica_odontologica",
  host: "localhost",
  dialect: "postgres",
};
```

### 5. Rodando as Migrações

Execute as migrações para criar as tabelas no banco de dados:

```bash
npx sequelize-cli db:migrate
```

## Funcionalidades

- **Cadastro de Pacientes**: Permite o cadastro de pacientes no banco de dados.
- **Cadastro de Consultas**: Permite o agendamento de consultas para os pacientes.
- **Listagem de Pacientes e Consultas**: Exibe a lista de pacientes e suas consultas futuras.
- **Exclusão de Pacientes**: Permite excluir pacientes da base de dados.
- **Cancelamento de Consultas**: Permite o cancelamento de consultas agendadas.

## Regras e Dicas

- **Paradigma Orientado a Objetos (OO)**: Utilize corretamente o paradigma OO, garantindo boa separação de responsabilidades, coesão, e acoplamento baixo entre as classes.
- **Boa Prática de Código**: Preste atenção na **indentação**, **nomes de variáveis e métodos**, **quantidade de parâmetros** e **separação de responsabilidades**.
- **Uso do Sequelize**: Utilize corretamente o Sequelize para mapear as tabelas no banco de dados e interagir com o PostgreSQL.
- **Mensagens de Erro**: As mensagens de erro devem ser claras e informativas, para facilitar a identificação de problemas na aplicação.

## Critérios de Avaliação

- **Paradigma Orientado a Objetos (OO)**: Aplicação correta do paradigma OO com separação e alocação de responsabilidades adequadas, garantindo coesão e acoplamento baixo.
- **Qualidade do Código**:
  - Boas práticas de indentação.
  - Nomes de variáveis e métodos claros e significativos.
  - Quantidade adequada de parâmetros nas funções.
  - Boa separação de responsabilidades entre as diferentes camadas da aplicação.
- **Uso Adequado do Sequelize**: Implementação correta do ORM Sequelize, com a definição e relacionamento das tabelas no PostgreSQL.
- **Tratamento de Erros**: Mensagens de erro apropriadas, exibindo informações detalhadas sobre problemas de acesso ao banco de dados ou de execução da aplicação.
