//const AsyncNedb = require('nedb-async')
const { AsyncNedb } = require('nedb-async')

module.exports = (name) => {

    const db = new AsyncNedb({
        filename: name + '.db',
        autoload: true,
    })

    return db

    //let db = {};
    //db = new Datastore(name + '.db');
    //db.loadDatabase();
    //return db
}

//var doc = { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false }
//}


//db.edition.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
//});

//db.edition.remove({ _id: 'id1' }, {}, function (err, numRemoved) {
  // numRemoved = 1
//});

