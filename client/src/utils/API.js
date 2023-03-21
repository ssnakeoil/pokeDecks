 const PokeCardAPIKey = process.env.REACT_APP_POKE_CARD_API_KEY;

 export const SearchCard = (query ) => {
    return fetch(` https://api.pokemontcg.io/v2/cards/${PokeCardAPIKey}/${query}`)}
