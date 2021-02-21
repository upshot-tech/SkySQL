
var SkySQL = (function() {
	return {
		async lookup(searchText, table, index, callback) {
			// start search

			let preIndexes = await getIndex(index, [searchText])
			// console.log('preIndexes', preIndexes)
			let indexes = await getData(index, preIndexes[0], searchText)
			// console.log('indexes', indexes)
			let dataIndexes = await getIndex('data', indexes)
			// console.log('dataIndexes', dataIndexes)
			let data = await getData('data', dataIndexes, indexes[0])
			// console.log("data:", data)

			callback(null, data)

			async function ajaxGet(url) {
				let response = await fetch(url)
				response = await response.text()
				return response
			}

			async function readFile(url) {
				let response = await ajaxGet(url)
				let lines = splitLines(response)
				let dataFileType = splitOneLine(lines[0])[0]
				return { 'lines': lines, 'dataFileType': dataFileType }
			}

			async function getIndex(column, searchArr) {
				let file = await readFile(table + '/' + column + "/index.txt")
				let equality = findEquality(file, '<=', searchArr)
				return [equality[0]]
			}

			async function getData(column, filename, searchFor) {
				let file = await readFile(table + '/' + column + '/' + filename)
				return findEquality(file, '==', [searchFor])
			}

			function findEquality(file, type, requirements) {
				if (type !== '==' && type !== '<=') {
					throw 'Equality type ' + type + ' is not implemented'
				}
				let found = []
				for (var i = 1; i < file.lines.length; i++) {
					if (typeof file.lines[i] == 'undefined' || file.lines[i] == '') { // end of lines
						break
					} else {
						var words = splitOneLine(file.lines[i])
						requirements.forEach(requirement => {
							if (type == '==') {
								if (words[0] == requirement) {
									found.push(words[1])
								}
							} else if (type == '<=') {
								if (words[0] <= requirement) {
									found.push(words[1])
								}
							}
						})
					}
				}
				// console.log('Equality found:', found)
				return found
			}

			function splitLines(text) {
				return text.split('\n')
			}

			function splitOneLine(line) {
				return line.split(/ (.*)/)
			}


			/* function searchInTable(lines) {
				for (var i = 0; i < lines.length; i++){
					if (lines[i].startsWith(searchText + ' ')) {
						let words = splitOneLine(lines[i])
						callback(null, words[1])
						try {
							console.log(JSON.parse(words[1]))
						} catch(err) {
							console.log('index found:', words[0])
						}
						return
					}
				}
			} */
		}

	}
})();