
<h1 align="center">NLW Copa - Web</h1>

![NLW Copa](https://user-images.githubusercontent.com/40326598/200138387-f97fb545-6de7-47aa-9d8f-a71f11ecb6a1.png)
---


<p align="center">
 <a href="#sobre-o-projeto">Sobre o projeto</a> |
 <a href="#layout">Layout</a> | 
 <a href="#como-usar">Como usar</a>
  <a href="#endpoints">Endpoints</a> 
</p>

<h4 align="center">
	 Status: Finalizada a etapa 1, vai ficar para o proximo PDI uma criação da versão web feita por mim.
</h4>
 
### Sobre o projeto💻

  Aplicação construída durante o evento NLW Copa disponibilizado pela Rocketseat na trilha Ignite. Aplicação foi dividida em 3 pastas, interface Web para cadastro de bolões(ainda farei uma versao do app completo para web), a pasta mobile com o app para criar, visualizar e compartilhar bolões e por fim a aplicação backend usada para fornecer as rotas, dados e serviços para o funcionamento das outras duas.

#### Feature

- [X] Cadastro e login de usuário
- [X] Cadastro de bolões
- [X] Listagem de bolões
- [X] Obter detalhes de um bolão
- [X] Listagem de jogos
- [X] Cadastro de palpites para um jogo em um bolão

#### Tecnologias🚀

As seguintes ferramentas foram usadas na construção do projeto:

- [x] [TypeScript](https://www.typescriptlang.org/).
- [X] [Node](https://nodejs.org/pt-br/).
- [x] [Nextjs](https://nextjs.org/) - Usado para a construção das telas.
- [x] [Prisma](https://www.prisma.io/) - Usado para a construção dos esquemas e migrações do banco de dados;
- [x] [Fastify](https://www.fastify.io/) - Usado para criar o servidor disponibilizando o recursos necessário para construir os endpoints da aplicação;
- [x] [Reactjs](https://reactjs.org/)
- [x] [React Native](https://reactnative.dev/) - construção do frontend Mobile

##### Padronização de código:

- [x] [ESLint](https://eslint.org/);
- [x] [Prettier](https://prettier.io/).
___
### Layout
Você pode visualizar o layout do projeto através [Deste link](https://www.figma.com/file/VnnLfmov3ZBOOG78Llhy06/Bol%C3%A3o-da-Copa-(Community)). É necessário ter conta no Figma para acessá-lo.

### Diagrama de entidade relacionamento

Estrutura organizacional das tabelas e seus relacionamentos.

![Diagrama de entidade relacionamento](https://user-images.githubusercontent.com/40326598/200139682-700f829e-eba1-4c41-a5a5-4a7e21fac9aa.png)

---

### Como usar
#### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

##### Clone este repositório
```bash
git clone https://github.com/PheNog/pool-system.git
```
##### Após clonar, acesse as pastas do projeto no terminal/cmd e instale as dependências
```bash
npm install
# ou npm i
```

##### Para executar o projeto, rode o seguinte comando  na pasta server e logo após na web:
```bash
npm run dev
```

##### Após isso, para rodar o projeto Mobile, entre na sua pasta respectiva e rode:

```bash
npx expo start
```
**OBS:**  Necessario baixar o expo go no seu celular para visualizar a aplicação mobile, aparecerá um QR CODE pra você no terminal da aplicação mobile


### EndPoints

#### Cadastro e login de usuário
Endpoint para cadastrar de usuário, é nessário fornecer um token gerado a partir do login social com o Google via OAuth2.

Método **POST** /users

```typescript
{
   "access_token": "token"
}
```
___

#### Contagem de bolões
Endpoint que retorna o numero de bolões ja criados.

Método **GET** /pools/count

#### Contagem de palpites
Endpoint que retorna o numero de palpites ja criados.

Método **GET** /guesses/count

#### Contagem de usuarios
Endpoint que retorna o numero de users ja criados.

Método **GET** /users/count

#### Cadastro de bolões
Endpoint para cadastrar um bolão, é nessário fornecer um `title` não podendo ser nulo ou sem valor no corpo da requisição. 

**OBS:** Esta rota requer autenticação sendo necessário passar o token obtido pós login no header da requisição como Bearer token no **Authorization**. 

Método **POST** /pools

```typescript
{
   "title": "title"
}
```
___
#### Listagem de bolões
Endpoint para obter uma listagem dos bolões existentes

**OBS:** Esta rota requer autenticação sendo necessário passar o token obtido pós login no header da requisição como Bearer token no **Authorization**. 

Método **GET** /pools
___
#### Obter detalhes de um bolão
Endpoint que busca os dados de um bolão existente, é nessário passar o `poolId` do bolão como parametro no endpoint. 

**OBS:** Esta rota requer autenticação sendo necessário passar o token obtido pós login no header da requisição como Bearer token no **Authorization**. 

Método **GET** /pools/:poolId
___
#### Listagem de jogos
Endpoint que busca a lista de jogos para um bolão, é necessário passar o `poolId` do bolão como parametro no endpoint. 

**OBS:** Esta rota requer autenticação sendo necessário passar o token obtido pós login no header da requisição como Bearer token no **Authorization**. 

Método **GET** /pools/:poolId/games
___
#### Cadastro de palpites para um jogo em um bolão
Endpoint para cadastrar um novo palpite em um bolão, é nessário passar no endpoint o `poolId` e `gameId` sendo respectivamente id do bolão e o id do jogo. Segue um
exemplo do body que deve ser passado para esta requisição:

**OBS:** Esta rota requer autenticação sendo necessário passar o token obtido pós login no header da requisição como Bearer token no **Authorization**. 

Método **POST** localhost:3333/pools/:poolId/games/:gameId/guesses

```typescript
{
   "firstTeamPoints": 0,
   "secondTeamPoints": 0,
}
```