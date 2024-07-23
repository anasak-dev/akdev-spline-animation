function extractNestedChildren(data) {
	let result = [];

	function recursiveExtract(array) {
		if (array) {
			for (const item of array) {
				if (item.children && item.children.length > 0) {
					result.push(item.children);
					recursiveExtract(item.children);
				}
			}
		}
	}

	recursiveExtract(data);

	return result;
}

export default extractNestedChildren;
