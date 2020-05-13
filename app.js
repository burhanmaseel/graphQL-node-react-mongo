const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
   schema: buildSchema(`
      type RootQuery {
         events: [String!]!
      }

      type RootMutation {
         createEvent(name: String): String
      }

      schema {
         query: RootQuery
         mutation: RootMutation
      }
   `),
   rootValue: {

   }
}));

app.get('/', (req, res, next) => {
   res.send('Hello world');
})

const port = process.env.PORT || 5000; //You can change the port by changing the static port number 5000 to any other port or you can define it in .env file
app.listen(port, () => console.log(`Server is running on port ${port}`));