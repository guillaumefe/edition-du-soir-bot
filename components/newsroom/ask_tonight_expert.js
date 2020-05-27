module.exports = (app, db, redis) => {

    return {
        question: ['demande à {{pseudo}} d\être notre expert de ce soir'],
        answer : () => {
            return "OK, j'ai demandé à {{pseudo}} d'être notre expert"
        }
    }
}
