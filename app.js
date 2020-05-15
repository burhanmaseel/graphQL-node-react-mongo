const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');
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

      type User {
         _id: ID!
         email: String!
         password: String
      }

      input EventInput {
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      input UserInput {
         email: String!
         password: String!
      }

      type RootQuery {
         events: [Event!]!
      }

      type RootMutation {
         createEvent(eventInput: EventInput): Event
         createUser(userInput: UserInput): User
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
            date: new Date(args.eventInput.date),
            creator: "5ebf082bc6186a2148a7ad85"
         });
         let createdEvent;
         return event
            .save()
            .then(result => {
               createdEvents = {...result._doc, _id: result._doc._id.toString()};
               return User.findById('5ebf082bc6186a2148a7ad85');
            })
            .then(user => {
               if (!user) {
                  throw new Error('User not found');
               }
               user.createdEvents.push(event);
               return user.save();
            })
            .then(result => {
               return createdEvents;
            })
            .catch(err => {
               console.log(err);
               throw err;
            });
      },
      createUser: (args) => {
         return User.findOne({ email: args.userInput.email })
            .then(user => {
               if (user) {
                  throw new Error('User exists already');
               }
               return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPasswrord => {
               const user = new User({
                  email: args.userInput.email,
                  password: hashedPasswrord
               });
               return user.save();
            })
            .then(result => {
               return { ...result._doc, password: null, _id: result.id }
            })
            .catch(err => {
               console.log(err);
               throw (err);
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