function getProperty(object, path) {
	if (!object || typeof(object) !== 'object') {
		return undefined;
	}
	var parts = path.split('.');
	return parts.length > 1 ? getProperty(object[parts.shift()], parts.join('.')) : object[path];
}

function hasProperty(object, path) {
	if (!object || typeof(object) !== 'object') {
		return false;
	}
	var parts = path.split('.');
	return parts.length > 1 ? hasProperty(object[parts.shift()], parts.join('.')) : Object.prototype.hasOwnProperty.call(object, path);
}

function setProperty(object, path, value) {
	if (object && typeof(object) === 'object') {
		var parts = path.split('.');
		if (parts.length > 1 && !Object.prototype.hasOwnProperty.call(object, parts[0])) {
			object[parts[0]] = {};
		}
		parts.length > 1 ? setProperty(object[parts.shift()], parts.join('.'), value) : object[path] = value;
	}
	return object;
}

function deleteProperty(object, path) {
	if (object && typeof(object) === 'object') {
		var parts = path.split('.');
		parts.length > 1 ? deleteProperty(object[parts.shift()], parts.join('.')) : delete object[path];
	}
	return object;
}

exports.getProperty = getProperty;
exports.hasProperty = hasProperty;
exports.setProperty = setProperty;
exports.deleteProperty = deleteProperty;