class SkySQL {
	constructor() {
		/* this.root = root; */
	}

	lookup(searchText, table, index, callback) {

		// start search
		ajaxGet(table + '/' + index + "/index.txt")


		// Perform ajax request recursively
		function ajaxGet(url) {
			var xhttp = new XMLHttpRequest()
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					// parse received data recursively
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
		
		var self = this
		function parseData(response) {
			let lines = getLines(response)
			let dataFileType = splitLine(lines[0])[0]

			// if .txt file is an index (top-level index or column_index)
			if (dataFileType == 'index' || dataFileType == 'column_index') {
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
						console.log('preindex found:', table + '/' + found)
						if (dataFileType == 'column_index') {
							searchText = found
							// set equalty type to '='
							ajaxGet(table + '/data/index.txt')
						} else {
							ajaxGet(table + '/' + found)
						}
						break;
					}
				}
			// if file is a table (data folder)
			} else if (dataFileType == 'table') {
				searchInTable(lines)
			} else {
				console.log('ERROR: invaid index file')
			}
		}

		function searchInTable(lines) {
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
		}

		function getLines(text) {
			return text.split('\n');
		}

		function splitLine(line) {
			return line.split(/ (.*)/)
		}


	}
}

