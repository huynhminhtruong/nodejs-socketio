function partition(array, start, end) {
	var pivot = array[start], i = start + 1

	for(var n = start + 1; n <= end; n++){
		if(array[n] < pivot){
			var tmp = array[n]
			array[n] = array[i]
			array[i] = tmp
			i += 1
		}
	}

	var p = array[start]
	array[start] = array[i - 1]
	array[i - 1] = p

	return i - 1
}

function array(array, start, end) {

}

function sort(array) {

}