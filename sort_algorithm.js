function insert_sort (array) {
	var p, max

	for(var i = 1; i < array.length; i++) {
		max = array[i]
		p = i - 1

		while (p >= 0 && array[p] > max) {
			array[p + 1] = array[p]
			p--;
		}

		array[p + 1] = max
	}

	return array
}

console.log(insert_sort([3, 2, 1, 5, 6, 4, 8, 7, 9]))