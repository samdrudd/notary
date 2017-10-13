var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

	app.get('/recipe/:id', (req, res) => {
		try
		{
			var details = { "_id": new ObjectID(req.params.id) };
		}
		catch(err)
		{
			res.status(400).send( { "error": "Invalid ID" } );
			return;
		}

		db.collection('recipes').findOne(details, (err, item) => {
			if (err)
				res.send( {"error" : err });
			else
				if (item === null)
					res.status(404).send({ "error" : "Recipe not found" } );
				else
					res.send(item);
		});
	});

	app.post('/recipe', (req, res) => {

		if (req.body.name === undefined || req.body.ingredients === undefined || req.body.instructions === undefined) 
			res.status(400).send( {"error" : "Malformed object"} );
		else if (req.body.name.trim() === "" || req.body.ingredients.length <= 0 || req.body.instructions.trim() == "")
			res.status(400).send( {"error" : "Empty name, ingredients, or instructions"} );
		else {		
			db.collection('recipes').insert( req.body , (err, result) => {
				if (err)
					res.send(req.statusText);
				else
					res.send(result.ops[0]);
			});
		}
	});
};
