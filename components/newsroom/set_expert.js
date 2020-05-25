module.exports = (db) => {

    return {
        question: ["designe {{pseudo}} comme expert ce soir", "designe {{pseudo}} comme étant expert ce soir"],
        answer : () => {

            return ["L'expert de ce soir est {{pseudo}}", "Entendu {{pseudo}} est l'expert de ce soir"]
        }
    }
}
