const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
        _id: ID!
        username: String!
        email: String
    }

    type Auth{
        token: ID!
        user: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: BookInput!): User
        removeBook(bookId: ID!): User
      }

`;

module.exports = typeDefs;