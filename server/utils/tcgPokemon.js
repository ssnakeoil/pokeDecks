const pokemon =require( 'pokemontcgsdk')

pokemon.configure({ apiKey: process.env.POKECARD_API_KEY })

exports.findCardbyName = async (name) => {
  console.log(name)
    try {
        const result = await pokemon.card.where({ q: `name:${name}` })
        // .then(result => {
        //     console.log(result.data[0].name) // "Blastoise"
        // })
        console.log(result.data)
        return result.data
    }
    catch (err) {
        console.log(err)
    }

}

exports.findCardById = async (id) => {
    console.log(id)
        try {
            const result = await pokemon.card.find(id)
            return result
        }
        catch (err) {
            console.log(err)
        }
}
