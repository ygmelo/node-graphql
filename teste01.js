const express       = require("express");
const graphlHTPP    = require("express-graphql");
const {buildSchema} = require("graphql");
const dataBase      = [{id:0, name: 'Teste0', age: 20}, {id:1, name: 'Teste1', age: 50}];

/*
@ QUERY
query getSingleUser($userID1: ID!, $userID2: ID!) {
	 user1: getUser(id: $userID1) {
	   name,
	   id
	 },
	 user2: getUser(id: $userID2) {
	   name,
	   id
	 }
}
query getSingleUserFragment($userID1: ID!, $userID2: ID!) {
   user1: getUser(id: $userID1) {
     ...userFields
   },
   user2: getUser(id: $userID2) {
     ...userFields
   }
}
fragment userFields on User {
  id, name
}
@ VARIABLES 
{
  "userID1": 0,
  "userID2": 1
}

// ------------------------------------------------------------
query getUsersByName($name: String, $age: Boolean!, $id: Boolean!) {
  getUsers(name: $name) {
    ...inputsUser
  }
}

fragment inputsUser on User {
  name , 
  id  @skip(if: $id), 
  age @skip(if: $age)
}

@ VARIABLES 
{
  "name": "Teste",
  "age": true,
  "id": true
}


mutation create {
	updateUser(id: 0, 
    input: {
    name: "Irineu",
    age:	54
  }) 
}
*/




// Esquema - Representação sistemática das Entidades
const schema = buildSchema(`
	input UserInput {
		name: String
		age: Int
	}

	type User {
		id: ID!
		name: String!
		age: String
	}

	type Query {
		getUser(id: ID!): User
		getUsers(name: String): [User]
	}

	type Mutation {
		createUser(input: UserInput): User
		updateUser(id: ID!, input: UserInput): User
	}
`);


// Classe - Representação do Esquema em JS
class User {
	constructor({id, name}) {
		this.id   = id;
		this.name = name;
	}
};


// Teste de Organização
class Query {

	static getUser({id}){
   	const oUser = dataBase.find(oObj =>oObj.id.toString() == id.toString());
    return new User(oUser);
	}

	static getUsers({name}){
  	if(name != null)
  		return dataBase.filter(oObj => oObj.name == name);
  	else 
  		return dataBase;
	}
}

// Teste de Organização
class Mutation {

	static createUser({input}){ 
  	input.id = require('crypto').randomBytes(10).toString('hex');
  	dataBase.push(input);
  	return new User(input);
	}

	static updateUser({id, input}){
  	dataBase.forEach((obj, i) => {
  		if(obj.id.toString() == id.toString()) {
  			dataBase[i].name = input.name;
  			dataBase[i].age  = input.age;
  		}
  	});

  	let oUser = dataBase.find(oObj => oObj.id.toString() == id.toString());

  	if(oUser == undefined)
  		throw new Error("Usuário inexistente");

  	return new User(oUser);
	}
}

// Resolvers
const root = {
  getUser   : Query.getUser,
  getUsers  : Query.getUsers,
  createUser: Mutation.createUser,
  updateUser: Mutation.updateUser
};

const app = express();
app.use('/graphql', graphlHTPP({
	schema   : schema,
	rootValue: root,
	graphiql : true
}));

app.listen(4000);
console.log("Runing in localhost:4000/graphql");