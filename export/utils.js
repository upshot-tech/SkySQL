const dir = __dirname + '/../dist'
const noop = () => {}

touchDir = function touchDir(folder) {
	if (!fs.existsSync(folder)){
		fs.mkdirSync(folder)
		return true
	} else {
		return false
	}
}

function initDataFolder() {
    if (touchDir(dir) == false) {
        console.log("The /dist folder already exist, please delete it.")
        process.exit(1)
    }
    
    fs.copyFile( __dirname + '/../viewer/example.html', dir + '/index.html', (err) => {
        if (err) throw err
        console.log('example.html was copied to index.html')
    })
    
    fs.copyFile(__dirname + '/../viewer/lookup.js', dir + '/lookup.js', (err) => {
        if (err) throw err
        console.log('source.txt was copied to destination.txt')
    })
}

function exportObjectToFile(fileAbsolutePath, object) {
    let exportString = JSON.stringify(object, null, "\t")
    fs.writeFileSync(fileAbsolutePath, exportString, noop)
}

function sortByKey(x, y) {
    if (x[0] < y[0]) {
        return -1
    }
    if (x[0] > y[0]) {
        return 1
    }
    return 0
}


function writeData(data, tablename, folder, meta) {
    touchDir(dir + '/' + tablename)
    let writefolder = dir + '/' + tablename + '/' + folder
    touchDir(writefolder)

    // write data to files
    // console.log('writing', Math.ceil(data.length/1000), 'files')
    if (folder == 'data') {
        var fileType = 'table'
    } else {
        var fileType = 'column_index'
    }
    var contentToWrite = '{"fileType": "' + fileType + '", "orderType": "' + meta.orderType + '", "colType": "' + meta.colType + '", "divider": " "}\n'

    var indexFileContent = '{"fileType": "index", "orderType": "' + meta.orderType + '", "colType": "' + meta.colType + '", "divider": " "}\n'
    var linesInFile = 0
    var nextFileName = 0
    var firstLineInFile = ''

    for (let i = 0; i < data.length; i++) {
        if (linesInFile < 1000) {
            contentToWrite += data[i][0] + ' ' + data[i][1] + '\n'
            if (linesInFile == 0) {
                firstLineInFile = data[i][0]
            }
            linesInFile += 1
        } else {
            fs.writeFileSync(writefolder + '/' + nextFileName + '.txt', contentToWrite, noop)
            linesInFile = 0
            if (folder == 'data') {
                var fileType = 'table'
            } else {
                var fileType = 'column_index'
            }            
            contentToWrite = '{"fileType": "' + fileType + '", "orderType": "' + meta.orderType + '", "colType": "' + meta.colType + '", "divider": " "}\n'
            indexFileContent += firstLineInFile + ' ' + nextFileName + '.txt\n'
            firstLineInFile = ''
            nextFileName += 1
        }
    }
    if (linesInFile != 0) {
        fs.writeFileSync(writefolder + '/' + nextFileName + '.txt', contentToWrite, noop)
        indexFileContent += firstLineInFile + ' ' + nextFileName + '.txt\n'
    }

    // WRITE indexFileContent
    // console.log('writing index file')
    fs.writeFileSync(writefolder + '/index.txt', indexFileContent, noop)
}

function stringifyData(rawData, primaryIndex) {
    data = []
    rawData.forEach(row => {
        
        // escape key strings if needed
        var rawKey = row[primaryIndex]
        if (typeof rawKey == 'string' && (rawKey.includes(' ') || rawKey.startsWith('"'))) {
            var escapedKey = escapeQuotes(rawKey)
        } else {
            var escapedKey = rawKey
        }

        let tempRow = {...row}
        delete tempRow[primaryIndex]
        jsonRow = JSON.stringify(tempRow)
        data.push([ escapedKey, jsonRow ])
    });
    return data
}

function stringifyIndex(rawData, primaryIndex, indexBy) {
    data = []
    rawData.forEach(row => {
        let rawKey = row[indexBy]
        if (typeof rawKey == 'string' && (rawKey.includes(' ') || rawKey.startsWith('"'))) {
            var escapedKey = escapeQuotes(rawKey)
        } else {
            var escapedKey = rawKey
        }
/* 
        try {
            escapedKey = escapedKey.toString()
        } catch (error) {
            // pass
        } */

        data.push([escapedKey, row[primaryIndex] ])
    });
    return data
}


function escapeQuotes(string) {
    return '"' + string.replace(/"/g, '\\"') + '"';
}
function unescapeQuotes(string) {
    if (string.startsWith('"') && string.endsWith('"')) {
        string = string.slice(1,-1);
    }
    return string.replace(/\\"/g, '"');
}


async function getTablesToExport(db, config) {
    const tablesRaw = config.tables
    if (tablesRaw[0].name == '*') {
        throw 'Given "*" for tables is not expected';
        // await db.getAllTables()
    } else {
        return config.tables
    }
}

async function getColsToExport(db, table) {
    if (table.columns == '*') {
        var cols = await getAllColumns(db, table.name)
    } else {
        var cols = table.columns
    }
    return cols
}

async function getIndexesToExport(db, table) {
    if (table.indexes == '*') {
        return await getAllColumns(db, table.name)
    } else {
        return table.indexes
    }
}

// returns all columns from a table as an array ['column1', 'column2']
async function getAllColumns(db, tableName) {
        const result = await db.getTableStructure(tableName)
        var columns = []
        for (var i=0; i < result.length; i++) {
            columns.push(result[i].column)
        }
        return columns
}

function getFieldType(tableSchema, index) {
    for (const i in tableSchema) {
        if (tableSchema[i].column == index) {
            return tableSchema[i].type
        }
    }
}

function getOrderTypeFromSchema(tableSchema, index) {
    for (const i in tableSchema) {
        if (tableSchema[i].column == index) {
            return {
                'orderType': getNumberOrString(tableSchema[i].type),
                'colType': tableSchema[i].type
            }
        }
    }
}

function getNumberOrString(type) {
    if (['int', 'int4', 'float'].includes(type.toLowerCase())) {
        return 'number'
    } else {
        return 'string'
    }
}

function joinToString(array, dbType) {
    var str = ''
    array.forEach(elem => {
        // join cols to string
        if (str != '') {
            str += ', '
        }
        if (dbType == 'postgres') {
            str += '"' + elem + '"'
        } else if (dbType == 'mysql') {
            str += '`' + elem + '`'
        } else {
            throw 'Database type "' + dbType + '" is not implemented'
        }
    })
    return str
}

function initTableName(tableName) {
    if (tableName == tableName.toLowerCase()) {
        return tableName
    } else {
        return '"' + tableName + '"'
    }
}

exports.stringifyIndex = stringifyIndex
exports.stringifyData = stringifyData
exports.writeData = writeData
exports.sortByKey = sortByKey
exports.initDataFolder = initDataFolder
exports.getTablesToExport = getTablesToExport
exports.getColsToExport = getColsToExport
exports.getIndexesToExport = getIndexesToExport
exports.initTableName = initTableName
exports.exportObjectToFile = exportObjectToFile
exports.joinToString = joinToString
exports.getOrderTypeFromSchema = getOrderTypeFromSchema
exports.getFieldType = getFieldType