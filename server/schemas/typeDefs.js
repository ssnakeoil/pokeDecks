const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
        _id: ID!
        username: String!
        email: String!
        savedCards: [Card]
        removedCards: [Card]
    }

    type Auth{
        token: ID!
        user: User
    }
    type Query {
      me: User
      card(name: String!): [Card]
    }


    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        cards(cardName: String!): [Card]
        saveCard(cardId: ID!): User
        removeCard(cardId: ID!): User
      }

      type Holofoil {
        low: Int
        mid: Float
        high: Float
        market: Float
        directLow: Float
      }
      
      type Prices {
        holofoil: Holofoil
      }
      
      type Tcgplayer {
        url: String
        updatedAt: String
        prices: Prices
      }
      
      type Images {
        small: String
        large: String
      }
      
      type Legalities {
        unlimited: String
        expanded: String
      }
      
      type Set {
        id: String
        name: String
        series: String
        printedTotal: Int
        total: Int
        ptcgoCode: String
        releaseDate: String
        updatedAt: String
        images: Images
        legalities: Legalities
      }
      
      type Weaknesses {
        type: String
        value: String
      }
      
      type Attacks {
        name: String
        convertedEnergyCost: Int
        damage: String
        text: String
        cost: [String]
      }
      
      type Card {
        id: String
        name: String
        supertype: String
        hp: String
        convertedRetreatCost: Int
        number: String
        artist: String
        rarity: String
        tcgplayer: Tcgplayer
        images: Images
        legalities: Legalities
        nationalPokedexNumbers: [Int]
        set: Set
        retreatCost: [String]
        weaknesses: [Weaknesses]
        attacks: [Attacks]
        rules: [String]
        evolvesTo: [String]
        types: [String]
        subtypes: [String]
      }
    

`;

module.exports = typeDefs;