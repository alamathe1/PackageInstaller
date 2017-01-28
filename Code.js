var pkgInstaller = function (inputObj) {
  
	/*Running pre-checks to check input validity*/
	if (inputObj === null || !Array.isArray(inputObj))
		throw 'Invalid input';
	inputObj.forEach(function(value) {
		if (typeof value !== 'string')
			throw 'Input data type invalid';
	});

	/*Creating a shallow copy of the input*/
	var copyinputObj = inputObj.slice();	
	
  /*Iterating through the input and scanning the package and its dependency*/
  var parsePackages = function() {
    var output = {};
    copyinputObj.forEach(function(item) {
      var items = item.split(':');

      var key = items[0].trim();
      var value = items[1].trim();

      if (key.length === 0) {
        throw 'Invalid package';
      }

      if (!output[key]) output[key] = [];
      if (!output[value] && value.length > 0) output[value] = [];
      if (value.length > 0)
        output[key].push(value);
    });
    return output;
  }

 /* Used to arrange / sort the input after checking its respective dependency*/
  var sortPkgDep = function(parsedPackages) {
    var output = []; 
    var sorted = {};

    Object.keys(parsedPackages).forEach(function(key) {
      sort(key, []);
    });

    function sort(key, parentReq) {
      if (sorted[key])
        return;
      parentReq.push(key);
      var pkg = parsedPackages[key];
      pkg.forEach(function(dependency) {
        if (parentReq.indexOf(dependency) >= 0) {
          throw 'Invalid dependency link';
        }
        sort(dependency, parentReq);
      });
      sorted[key] = true;
      output.push(key);
    }

    return output;
  }

	return {
		checkInsDep: function() {
			var parsedPackages = parsePackages();
			return sortPkgDep(parsedPackages).join(', ');
		}
	};
};

/* Sample Input*/
var checkInput = [
"KittenService: ",
"Leetmeme: Cyberportal",
"Cyberportal: Ice",
"CamelCaser: KittenService",
"Fraudstream: Leetmeme",
"Ice: "];

/*Running output onto console*/
console.log(pkgInstaller(checkInput).checkInsDep());