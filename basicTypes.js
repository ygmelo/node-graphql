const express         = require("express");
const graphlHTPP      = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
	type Query {
		quoteOfTheDay: String,
		random       : Float!,
		rollThreeDice: [Int]
	}
`);

var root = {
	quoteOfTheDay: () => {
		return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
	},
	random: () => {
		return Math.random();
	},
	rollThreeDice: () => {
		return [1,2,3].map(_ => 1 + Math.floor(Math.random() * 6));
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