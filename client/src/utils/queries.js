import { gql } from '@apollo/client';

export const QUERY_CARDS = gql`{

    card {
        _id
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
 }`

export const QUERY_ME = gql`{
    me {
        _id
        username
        email
        cardCount
        savedCards {
            _id
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
},`

export const SAVE_CARD = gql`
    mutation saveCard($card: CardInput!) {
        saveCard(card: $card) {
            _id
            username
            email
            savedCards {
                _id
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

export const REMOVE_CARD = gql`
    mutation removeCard($card: CardInput!) {
        removeCard(card: $card) {
            _id
            username
            email
            savedCards {
                _id
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