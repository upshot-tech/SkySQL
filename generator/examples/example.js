var skysql = require('../../generator/generate');

(async() => {

	let config = {
			// Put your database credentials here
			"dbConfig": {
				"type": "mysql", // mysql or postgres
				"host": "127.0.0.1",
				"user": "root",
				"password": "",
				"database": "skysql"
			},
			// Enter tables and columns you want to export.
			// Please specify indexes for columns you want to ORDER BY later.
			"tables": [
				{
					"name": "example_table_1",
					"columns": [ "id", "c1", "c2", "c3" ],
					"indexes": [ "c1", "c2" ]
				},
				{
					"name": "example_table_2",
					"columns": "*",
					"indexes": "*"
				}
			]
		}
	console.log('before start');
	await skysql.generate(config);
	console.log('after finish');

})();