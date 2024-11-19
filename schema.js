const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type Posts {
    id: ID
    content: String
    title: String
    userId: Int
  }
  input PostsByUser {
    content: String!
    title: String!
    userId: Int!
  }
  input PostsUpdate {
    id: ID!
    content: String!
  }
  input PostsDelete {
    id: ID!
  }
  input Combine {
    id: ID!
    email: String!
  }
  type DeleteResponse {
    message: String!
    deletedPost: Posts
  }
  type UP {
    id: ID
    name: String
    email: String
    posts: [Posts!]!
  }
  input UPostRegistration {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getAllPosts: [Posts!]!
    getUserPosts(id: ID!): [UP!]!
    getCombined(input: Combine!): [UP!]!
  }
  type Mutation {
    deletePosts(input: PostsDelete!): DeleteResponse!
    updatePosts(input: PostsUpdate!): [Posts!]!
    loginUPosts: Posts
    insertPost(input: PostsByUser!): Posts!
    registrationUPosts(input: UPostRegistration!): [UP!]!
  }
`;
module.exports = typeDefs;
