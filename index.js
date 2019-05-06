const server = require('./server.js');
const knex = require('knex');

const KnexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.db3'
  },
  useNullAsDefault: true
};

const db = knex(KnexConfig);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\n **** Server is listening on port: ${port} ****\n`);
});
