require('dotenv').config();
const Fastify = require('fastify');
const mercurius = require('mercurius');
const fastifyJwt = require('@fastify/jwt');
const fastifyPostgres = require('@fastify/postgres');
const fs = require('fs');
const path = require('path');

const app = Fastify({ logger: true });

app.register(fastifyJwt, { secret: process.env.JWT_SECRET });
app.register(fastifyPostgres, {
    connectionString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`
});

const schema = fs.readFileSync(path.join(__dirname, '../schema.graphql'), 'utf8');

const resolvers = {
  Query: {
    me: async (_, __, { reply }) => {
      try {
        const user = await reply.jwtVerify();
        const { rows } = await app.pg.query(
          'SELECT id, email, displayname AS "displayName", created_at AS "createdAt" FROM users WHERE id = ',
          [user.sub]
        );
        return rows[0] || null;
      } catch {
        return null;
      }
    },
    users: async () => {
      const { rows } = await app.pg.query(
        'SELECT id, email, displayname AS "displayName", created_at AS "createdAt" FROM users'
      );
      return rows;
    }
  },
  Mutation: {
    signUp: async (_, { email, password, displayName }) => {
      const { rows } = await app.pg.query(
        'INSERT INTO users(email, password, displayname) VALUES(,,) RETURNING id',
        [email, password, displayName]
      );
      return app.jwt.sign({ sub: rows[0].id });
    },
    login: async (_, { email, password }) => {
      const { rows } = await app.pg.query(
        'SELECT id, password FROM users WHERE email = ',
        [email]
      );
      if (!rows.length || rows[0].password !== password) {
        throw new Error('Identifiants invalides');
      }
      return app.jwt.sign({ sub: rows[0].id });
    }
  }
};

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
  context: (request, reply) => ({ reply })
});

const start = async () => {
  try {
    await app.listen({ port: process.env.PORT || 4000, host: '0.0.0.0' });
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphiql`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
