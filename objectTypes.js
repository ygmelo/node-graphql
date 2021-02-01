const express         = require("express");
const graphlHTPP      = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
	type RandomDie {
		numSides: Int!
		rollOnce: Int!
		roll(numRolls: Int!): [Int]
		teste(a: String): String
	}

	type Query {
		getDie(numSides: Int): RandomDie
	}
`);

class RandomDie {
	constructor(numSides){
		this.numSides = numSides;
	}
  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }
  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
  teste({a}) {
  	return a;
  }
}

var root = {
	getDie: ({numSides}) => {
		return new RandomDie(numSides || 6);
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