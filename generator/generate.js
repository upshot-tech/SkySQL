const { initDataFolder, sortByKey, writeData, stringifyData, stringifyIndex,
		getTablesToExport, getColsToExport, getIndexesToExport, initTableName } = require('./utils')

fs = require('fs')
const config = require('config')

const dbType = config.get('dbConfig.type')
const { DB } = require('./databases/' + dbType)
const db = new DB


exports.generate = async function generate()  {
	// remove dist folder 
	fs.rmdirSync(__dirname + '/../dist', { recursive: true });

	// make new dist folder with initial files
	initDataFolder()

	const tables = await getTablesToExport(db)
	// iterate on all tables
	for (table of tables) {

		// get primary indexed column
		const primaryIndex = await db.getPrimary(table.name)
		
		console.log('Exporting "' + table.name + '" table. Primary index:', primaryIndex)
		
		// get all column names for export
		const cols = await getColsToExport(db, table)

		const tableQueryName = initTableName(table.name)
		const rawData = await db.query('SELECT ' + cols + ' FROM ' + tableQueryName)
		const colData = stringifyData(rawData, primaryIndex)
		// console.log('Sorting', colData.length, 'rows')
		colData.sort(sortByKey)
		writeData(colData, table.name, 'data')

		const indexes = await getIndexesToExport(db, table)
		// export all indexes
		for (index of indexes) {
			const indexData = stringifyIndex(rawData, primaryIndex, index)
			//console.log('Sorting', indexData.length, 'rows')
			indexData.sort(sortByKey)
			writeData(indexData, table.name, index)
		}
	}
	db.end()
	return true
}
