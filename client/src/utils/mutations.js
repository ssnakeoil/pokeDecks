import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_CARD = gql`
  mutation saveCard($cardID: ID!) {
    saveCard(cardId: $cardID) {
      _id
      username
      email
      savedCards {
        id
        name
        images {
          small
        }
        set {
          series
        }
        number
        rarity
        artist
        tcgplayer {
          url
          updatedAt
          prices {
            holofoil {
              low
              mid
              high
              market
              directLow
            }
          }
        }
      }
    }
  }
`;

export const REMOVE_CARD = gql`
  mutation removeCard($cardId: ID!) {
    removeCard(cardId: $cardId) {
      _id
      username
      email
      savedCards {
        id
        name
        image
        set
        number
        rarity
        artist
        tcgplayer {
          url
          updatedAt
          prices {
            holofoil {
              low
              mid
              high
              market
              directLow
            }
          }
        }
      }
    }
  }
`;
