class SkyLookUp {
	constructor(root) {
		this.root = root;
	}

	lookup(searchText, index, callback) {
	
		function ajaxGet(url) {
			var xhttp = new XMLHttpRequest()
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					parseData(this.responseText)
				} else if (this.readyState == 4 && this.status == 0) {
					callback(`CORS blocked, please open this file without the 'file:///"" protocol
						(you can use any localhost server or just upload the folder to Skynet)`, null)
				} else if (this.readyState == 4) {
					callback('Error reading remote file, status code: ' + this.status, null)
				}
			};
			xhttp.open("GET", url, true)
			xhttp.send()
		}

		function getLines(text) {
			return text.split('\n');
		}
		
		var self = this
		function parseData(response) {
			let lines = getLines(response)
			let firstLine = lines[0]
			let splittedFirstLine = firstLine.split(/ (.*)/)	// split string by first space
			if (splittedFirstLine[0] == 'index' || splittedFirstLine[0] == 'column_index') {
				let lastWord = null
				let found = null
				for (var i = 0; i < lines.length; i++){
					if (typeof lines[i+1] == 'undefined') {
						found = lines[i].split(/ (.*)/)[1]
					} else {
						var words = lines[i+1].split(/ (.*)/)
						if (words[0] > searchText || lines[i+1] == '\n' || lines[i+1] == '') {
							found = lastWord
							console.log('found', found)
						}
					}

					if (found == null) {
						lastWord = words[1]
					} else {
						console.log('preindex found:', self.root + '/' + found)
						if (splittedFirstLine[0] == 'column_index') {
							searchText = found
							ajaxGet(self.root + '/data/index.txt')
						} else {
							ajaxGet(self.root + '/' + found)
						}
						break;
					}
				}
			} else if (splittedFirstLine[0] == 'table') {
				for (var i = 0; i < lines.length; i++){
					if (lines[i].startsWith(searchText + ' ')) {
						let words = lines[i].split(/ (.*)/)
						callback(null, words[1])
						try {
							console.log(JSON.parse(words[1]))
						} catch(err) {
							console.log('index found:', words[0])
						}
						return
					}
				}
				changePrint('Not found :(')
			} else {
				console.log('ERROR: invaid index file')
			}
		}

		// start search
		ajaxGet(this.root + '/' + index + "/index.txt")
	}
}

