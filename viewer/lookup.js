
var SkySQL = (function() {
	
	return {
		lookup,
		getScheme
	}

	async function lookup(searchText, table, column) {
		// start search
		let preIndexes = await getIndex(table, column, [searchText])
		console.log('preIndexes', preIndexes)

		let indexes = await getData(table, column, preIndexes, [searchText])
		console.log('indexes', indexes)

		let dataIndexes = await getIndex(table, 'data', indexes)
		console.log('dataIndexes', dataIndexes)

		let data = await getData(table, 'data', dataIndexes, indexes)
		console.log("data:", data)

		let dataJSON = rawArrayToJSON(data)
		console.log("dataJSON:", dataJSON)

		return data
	}

	async function getScheme() {
		let scheme = await ajaxGet('scheme.json')
		return JSON.parse(scheme)
	}


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

	async function getIndex(table, column, searchArr) {
		let file = await readFile(table + '/' + column + "/index.txt")
		let equality = findEquality(file, '==', searchArr)
		 console.log('equality', equality)
		let lessThanEquality = findEquality(file, '<', searchArr)
		 console.log('lessThanEquality', lessThanEquality)
		let lastLessThanEquality = lessThanEquality[lessThanEquality.length-1]
		if (!equality.includes(lastLessThanEquality) && lessThanEquality.lengt > 0) {
			equality.push(lastLessThanEquality)
		}
		return equality
	}

	async function getData(table, column, filenameArr, searchArr) {
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
		const fileStruct = JSON.parse(file.lines[0])
		const orderType = fileStruct.orderType
		let found = []
		for (var i = 1; i < file.lines.length; i++) {
			if (typeof file.lines[i] == 'undefined' || file.lines[i] == '') { // end of lines
				break
			} else {
				var words = splitOneLine(file.lines[i])
				requirements.forEach(requirement => {
					if (orderType == 'number') {
						var w1 = parseFloat(words[0])
						var w2 = parseFloat(requirement)
					} else if (orderType == 'string') {
						var w1 = words[0].toString()
						var w2 = requirement.toString()
					} else {
						throw 'orderType ' + orderType + ' not expected'
					}

					if (compare(w1, w2, type) === true) {
						found.push(words[1])
					}
				})
			}
		}
		return found
	}

	function compare(w1, w2, equalityType) {
		switch (equalityType) {
			case '==':
				if (w1 == w2) {
					return true
				}
				break

			case '<=':
				if (w1 <= w2) {
					return true
				}
				break

			case '<':
				if (w1 < w2) {
					return true
				}
				break
		
			default:
				throw 'Equality type ' + type + ' is not implemented'
				break
		}
		return false
	}

	function splitLines(text) {
		return text.split('\n')
	}

	function splitOneLine(line) {
		return line.split(/ (.*)/)
	}
})();