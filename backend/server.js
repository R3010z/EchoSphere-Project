import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { gql } from "graphql-tag";

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS";

app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.sendStatus(401);
    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch {
        return res.sendStatus(403);
    }
}

// REST routes ...
// (Placez ici toutes les routes utilisateur et post)

const typeDefs = gql`
  scalar DateTime
  type User {
    id: Int!
    email: String!
    name: String
    posts: [Post!]!
  }
  type Post {
    id: Int!
    title: String!
    content: String
    createdAt: DateTime
    user: User!
  }
  type Query {
    me: User
    users: [User!]!
    posts: [Post!]!
  }
  input PostInput {
    title: String!
    content: String
  }
  type Mutation {
    createPost(data: PostInput!): Post!
    updatePost(id: Int!, data: PostInput!): Post!
  }
`;

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return prisma.user.findUnique({ where: { id: user.userId }, include: { posts: true } });
    },
    users: () => prisma.user.findMany({ include: { posts: true } }),
    posts: () => prisma.post.findMany({ include: { user: true } }),
  },
  Mutation: {
    createPost: async (_, { data }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return prisma.post.create({ data: { ...data, userId: user.userId } });
    },
    updatePost: async (_, { id, data }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) throw new Error("Post not found");
      if (post.userId !== user.userId) throw new Error("Access denied");
      return prisma.post.update({ where: { id }, data });
    },
  },
  User: {
    posts: (parent) => prisma.post.findMany({ where: { userId: parent.id } }),
  },
  Post: {
    user: (parent) => prisma.user.findUnique({ where: { id: parent.userId } }),
  },
};

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
          try {
            const user = jwt.verify(token, JWT_SECRET);
            return { user };
          } catch {}
        }
        return {};
      },
    })
  );

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Server ready at http://localhost:${port}/graphql`));
}

start();
