const express         = require("express");
const graphlHTPP      = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
	type Query {
		rollDice(numDice: Int!, numSides: Int): [Int]
	}
`);

var root = {
	rollDice: ({numDice, numSides}) => {
		let output = [];

		for(let i =0; i < numDice; i++) 
			output.push(1 + Math.floor(Math.random() * (numSides || 6)));

		return output;
	},
};

const app = express();
app.use('/graphql', graphlHTPP({
	schema   : schema,
	rootValue: root,
	graphiql : true
}));

app.listen(4000);
console.log("Runing in localhost:4000/graphql");