const { ApolloServer } = require('apollo-server-express');
const { gql } = require('apollo-server-express');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_TO_A_REAL_SECRET';

app.use(cors());
app.use(express.json());

// Auth middleware (identique à server.js)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- ROUTES REST (exemple minimal, à compléter avec tes routes actuelles) ---
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- SCHEMA & RESOLVERS GRAPHQL ---
const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    name: String
    posts: [Post!]
  }
  type Post {
    id: Int!
    title: String!
    content: String
    user: User!
  }
  type Query {
    me: User
    users: [User!]
    posts: [Post!]
  }
`;

const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.user) return null;
      return prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { posts: true },
      });
    },
    users: () => prisma.user.findMany({ include: { posts: true } }),
    posts: () => prisma.post.findMany({ include: { user: true } }),
  },
  User: {
    posts: (parent) => prisma.post.findMany({ where: { userId: parent.id } }),
  },
  Post: {
    user: (parent) => prisma.user.findUnique({ where: { id: parent.userId } }),
  },
};

// --- APOLLO SERVER ---
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}

startApollo();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serveur Express+GraphQL démarré sur le port ${port}`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
});
