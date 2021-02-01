const express         = require("express");
const graphlHTPP      = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
	type Query {
		hello: String,
		teste: String
	}
`);

var root = {
	hello: () => {
		return 'Hello World';
	},
	teste: () => {
		return 'Teste'
	}
};

const app = express();
app.use('/graphql', graphlHTPP({
		schema   : schema,
		rootValue: root,
		graphiql : true
}));

app.listen(4000);
console.log("Runing in localhost:4000/graphql");