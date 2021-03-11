
var SkySQL = (function() {
	return {
		async lookup(searchText, table, column, callback) {
			// start search

			let preIndexes = await getIndex(column, [searchText])
			console.log('preIndexes', preIndexes)
			let indexes = await getData(column, preIndexes, [searchText])
			console.log('indexes', indexes)
			let dataIndexes = await getIndex('data', indexes)
			console.log('dataIndexes', dataIndexes)
			let data = await getData('data', dataIndexes, indexes)
			console.log("data:", data)
			let dataJSON = rawArrayToJSON(data)
			console.log("dataJSON:", dataJSON)

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
				let equality = findEquality(file, '==', searchArr)
				let lessThanEquality = findEquality(file, '<=', searchArr)
				let lastLessThanEquality = lessThanEquality[lessThanEquality.length-1]
				if (!equality.includes(lastLessThanEquality)) {
					equality.push(lastLessThanEquality)
				}
				return equality
			}

			async function getData(column, filenameArr, searchArr) {
				let data = []

				for await (filename of filenameArr) {
					let file = await readFile(table + '/' + column + '/' + filename)
					let foundArr = findEquality(file, '==', searchArr)
					foundArr.forEach(found => {
						data.push(found)
					});
				}

				return data
			}

			function rawArrayToJSON(rawArr) {
				jsonArr = []
				rawArr.forEach(raw => {
					try {
						var jsonData = JSON.parse(raw)
					} catch (error) {
						console.log('Failed to convert data:', raw)
						throw error
					}
					jsonArr.push(jsonData)
				});
				return jsonArr
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
								if (parseFloat(words[0]) <= parseFloat(requirement)) {
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

		}

	}
})();