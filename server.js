const {graphql , buildSchema} = require("graphql");

const schema = buildSchema(`
	type Query {
		hello: String
	}
`);

var root = {
	hello: () => {
		return 'Hello World';
	},
};

graphql(schema, '{ hello }', root).then((response) => {
	console.log(response);
})