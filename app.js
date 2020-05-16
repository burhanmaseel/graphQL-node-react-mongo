const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();


app.use(bodyParser.json());



app.use('/graphql', graphqlHttp({
   schema: graphQlSchema,
   rootValue: graphQlResolvers,
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