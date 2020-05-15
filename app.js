const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/events');
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
         return Event.find()
            .then(events => {
               return events.map(event => {
                  return { ...event._doc, _id: event.id }
               });
            })
            .catch(err => {
               console.log(err);
               throw (err);
            });
      },
      createEvent: (args) => {
         const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date)
         });
         return event.save().then(result => {
            console.log(result);
            return { ...result._doc };
         }).catch(err => {
            console.log(err);
            throw err;
         });
      }
   },
   graphiql: true
}));

app.get('/', (req, res, next) => {
   res.send('Hello world');
});
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-2kvex.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
   console.log('Database Successfully Connected');
}).catch(err => {
   console.log(`Database Connection Error: ${err}`);
});

const port = process.env.PORT || 5000; //You can change the port by changing the static port number 5000 to any other port or you can define it in .env file
app.listen(port, () => console.log(`Server is running on port ${port}`));