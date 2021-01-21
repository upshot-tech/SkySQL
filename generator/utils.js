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

function sortByKey(x, y) {
    if (x[0] < y[0]) {
        return -1
    }
    if (x[0] > y[0]) {
        return 1
    }
    return 0
}


function writeData(data, folder) {
    touchDir(dir + '/' + folder)

    // write data to files
    console.log('writing', Math.ceil(data.length/1000), 'files')
    var indexFileContent = 'index #\n'
    var linesInFile = 0
    var contentToWrite = 'final #\n'
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
            fs.writeFileSync(dir + '/' + folder + '/' + nextFileName + '.txt', contentToWrite, noop)
            linesInFile = 0
            contentToWrite = 'final #\n'
            indexFileContent += firstLineInFile + ' ' + folder + '/' + nextFileName + '.txt\n'
            firstLineInFile = ''
            nextFileName += 1
        }
    }
    if (linesInFile != 0) {
        fs.writeFileSync(dir + '/' + folder + '/' + nextFileName + '.txt', contentToWrite, noop)
        indexFileContent += firstLineInFile + ' ' + folder + '/' + nextFileName + '.txt\n'
    }

    // WRITE indexFileContent
    console.log('writing index file')
    fs.writeFileSync(dir + '/' + folder + '/index.txt', indexFileContent, noop)
}

exports.writeData = writeData
exports.sortByKey = sortByKey
exports.initDataFolder = initDataFolder