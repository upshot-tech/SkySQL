touchDir = function touchDir(dir) {
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
		return true
	} else {
		return false
	}
}

exports.initDataFolder = function initDataFolder() {
    var dir = __dirname + '/../dist';
    if (touchDir(dir) == false) {
        console.log("The /dist folder already exist, please delete it.")
        process.exit(1)
    }
    
    touchDir(dir + '/data')
    
    fs.copyFile( __dirname + '/../viewer/example.html', dir + '/index.html', (err) => {
        if (err) throw err;
        console.log('example.html was copied to index.html');
    });
    
    fs.copyFile(__dirname + '/../viewer/lookup.js', dir + '/lookup.js', (err) => {
        if (err) throw err;
        console.log('source.txt was copied to destination.txt');
    });
}

exports.sortByKey = function sortByKey(x, y) {
    if (x[0] < y[0]) {
        return -1;
    }
    if (x[0] > y[0]) {
        return 1;
    }
    return 0;
}