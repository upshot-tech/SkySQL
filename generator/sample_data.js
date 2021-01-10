// increase array element. Maximum is the maximum of one element. Element overflow, if everything is max, false returned
function increaseArray(array, max) {
	for (let index = array.length -1; index >= 0; index--) {
		if (array[index] < max) {
			array[index] += 1
			return array
		} else {
			array[index] = 0
		}
	}
	return false
}

// return a dict filled with example data
exports.generateExampleDict = function generateExampleDict(maxStrLen) {
	let input = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
				  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
				  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
	 ]
	// let input = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o' ]
	
	var data = []
	for (let i = 1; i <= maxStrLen; i++) {
		console.log('generating', i, 'length')
		//generate number array
		var startArray = []
		for (let j = 0; j < i; j++) {
			startArray.push(0)
		}


		while (startArray) {
			if (i >= 5 && startArray[startArray.length - 1] == 0 && startArray[startArray.length - 2] == 0 && startArray[startArray.length - 3] == 0) {
				console.log(startArray)
			}
			string = ''
			for (let k = 0; k < startArray.length; k++) {
				string += input[startArray[k]]
				
			}
			data.push([string, "This_is_an_example_value_for_key_" + string])
			startArray = increaseArray(startArray, input.length-1)
		}
	}
	return data
}