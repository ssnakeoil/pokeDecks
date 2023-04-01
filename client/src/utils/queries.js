import { gql } from '@apollo/client';

export const QUERY_ME = gql`
query Me {
  me {
    savedCards {
      id
      images {
        small
      }
      name
      rarity
      set {
        series
      }
      tcgplayer {
        prices {
          holofoil {
            low
            mid
            high
            market
            directLow
          }
        }
        url
      }
    }
    _id
    email
  }
}`;

export const QUERY_CARDS = gql`
query Query($name: String!) {
  card(name: $name) {
    id
    images {
      small
    }
    name
    rarity
    set {
      series
    }
    tcgplayer {
      prices {
        holofoil {
          low
          mid
          high
          market
          directLow
        }
      }
      url
    }
    
  }
}
`;
