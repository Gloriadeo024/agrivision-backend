const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Comment {
    id: ID!
    text: String!
    author: String!
    createdAt: String!
  }

  type Mutation {
    addComment(text: String!, author: String!): Comment!
  }
`;

module.exports = typeDefs;
