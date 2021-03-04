var skysql = require('../../generator/generate');

(async() => {

	let config ={
			// Put your database credentials here
			"dbConfig": {
				"type": "postgres", // mysql or postgres
				"host": "127.0.0.1",
				"user": "",
				"password": "",
				"database": ""
			},
			// Enter tables and columns you want to export.
			// Please specify indexes for columns you want to ORDER BY later.
			"tables": [
				{
					"name": "asset_events",
					"columns": "*",
					"indexes": "*"
				},
				{
					"name": "assetGroups",
					"columns": "*",
					"indexes": "*"
				},
				{
					"name": "assets",
					"columns": "*",
					"indexes": "*"
				},
				{
					"name": "comparisons",
					"columns": "*",
					"indexes": "*"
				},
				{
					"name": "groups",
					"columns": "*",
					"indexes": "*"
				},
				{
					"name": "messages",
					"columns": "*",
					"indexes": "*"
				}
			]
		}
		
	await skysql.generate(config);

})();