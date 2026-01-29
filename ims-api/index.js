import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import graphlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import schema from './schema';
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const accountSid = 'AC7a013a504a7e7b29c9eb108ce73b2ba4';
const authToken = '8b499d93a902e5ad56728d21f4f0f36e';
const TWILIO_PHONE_NUMBER = '+15108248735';
const client = require('twilio')(accountSid, authToken);

// const client = twilio(obj.accountSid, obj.authToken);

// const client = require('twilio')(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/jdent-demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const PORT = 4300;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body,
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.get('/', (req, res) => {
  res.json({
    message: 'JD enterprises API v1',
  });
});
app.use(
  '/graphql',
  graphlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
