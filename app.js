const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
   schema: buildSchema(`
      type Event {
         _id: ID!
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      input EventInput {
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      type RootQuery {
         events: [Event!]!
      }

      type RootMutation {
         createEvent(eventInput: EventInput): Event
      }

      schema {
         query: RootQuery
         mutation: RootMutation
      }
   `),
   rootValue: {
      events: () => {
         return events;
      },
      createEvent: (args) => {
         const event = {
            _id: Math.random().toString(),
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: args.eventInput.date
         };
         console.log(event);
         events.push(event);
         return event;
      }
   },
   graphiql: true
}));

app.get('/', (req, res, next) => {
   res.send('Hello world');
})

const port = process.env.PORT || 5000; //You can change the port by changing the static port number 5000 to any other port or you can define it in .env file
app.listen(port, () => console.log(`Server is running on port ${port}`));