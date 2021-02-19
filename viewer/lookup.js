
var SkySQL = (function() {
	return {
		async lookup(searchText, table, index, callback) {
			// start search

			indexes = getIndexes()

			async function ajaxGet(url) {
				let response = await fetch(url)
				response = await response.text()
				return response
			}
			
			async function getIndexes() {
				let response = await ajaxGet(table + '/' + index + "/index.txt")
				let lines = getLines(response)
				let dataFileType = splitLine(lines[0])[0]

			}

			function parseData(response) {

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
				return text.split('\n')
			}

			function splitLine(line) {
				return line.split(/ (.*)/)
			}
		}

	}
})();