const { initDataFolder, sortByKey, writeData, stringifyData, stringifyIndex,
		getTablesToExport, getColsToExport, getIndexesToExport, initTableName } = require('./utils')

fs = require('fs')
const config = require('config')

const dbType = config.get('dbConfig.type')
const { DB } = require('./databases/' + dbType)
const db = new DB


exports.generate = async function generate()  {
	return await new Promise((resolve, reject) => {
		// remove dist folder 
		fs.rmdirSync(__dirname + '/../dist', { recursive: true });

		// make new dist folder with initial files
		initDataFolder()

		// I hate this callback hell, but class functions + mysql are not compatible with async/await. Took 2 hours to realize.
		getTablesToExport(db, function(tables) {
			// iterate on all tables
			tables.forEach(table => {
				console.log('Exporting "' + table.name + '" table')
				// get primary indexed column
				db.getPrimary(table.name, function(primaryIndex) {
					console.log('primaryIndex:', primaryIndex)
					
					
					// get all column names for export
					getColsToExport(db, table, function(cols) {
						// iterate on all tables
						tableQueryName = initTableName(table.name)
						db.query('SELECT ' + cols + ' FROM ' + tableQueryName, function(rawData) {

							data = stringifyData(rawData, primaryIndex)
							console.log('Sorting', data.length, 'rows')
							data.sort(sortByKey)
							writeData(data, table.name, 'data')

							getIndexesToExport(db, table, function(indexes) {
								// export all indexes
								indexes.forEach(index => {
									data = stringifyIndex(rawData, primaryIndex, index)
									console.log('Sorting', data.length, 'rows')
									data.sort(sortByKey)
									writeData(data, table.name, index)
								})
								
								db.end()
								resolve(true)
							})
						})
					})
				})
			})
		})
	})
}
