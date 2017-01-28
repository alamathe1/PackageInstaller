//Main test suite
describe('Dependency and Package Installer', function() {
	
  it('input accepts an array of strings', function() {
		var inputObj = ['p:q','r:s'];
		var installer = new pkgInstaller(['p:q','r:s']);
	    expect(installer.inputObj).toEqual(inputObj);
  });

  it('type is an object', function() {
    expect(typeof pkgInstaller).toBe('function');
  });

    it('output returns a string', function() {
    expect(new pkgInstaller(['p:q','r:s']).checkInsDep()).toEqual(jasmine.any(String));
  });


  describe('program fails when', function() {
	  
	it('given an object', function() {
      expect(function() { new pkgInstaller({ p:'q' }); }).toThrow();
    });
	
	it('given a number', function() {
      expect(function() { new pkgInstaller(1); }).toThrow();
    });
	  
    it('given a string', function() {
      expect(function() { new pkgInstaller('p'); }).toThrow();
    });

    it('array contains object', function() {
      expect(function() { new pkgInstaller([{p:'q'},{r:'s'}]); }).toThrow();
    });

    it('array contains numbers', function() {
      expect(function() { new pkgInstaller([1,2]); }).toThrow();
    });

    
  });

  describe('should thorw error', function() {
    it('because of a invalid round check', function () {
      expect(function () {
        var packageInstaller = pkgInstaller(['p:q', 'r:s']);
				packageInstaller.checkInsDep();
      }).toThrow('Invalid dependency link');
    });
  });

  describe('will be successfull', function() {
    it('when valid input links are passed', function() {
      var input = ['p:'];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('p');
    });
	
	it('with symbols and quotes', function() {
      var input = [
        '!@#$%^&*()_+""{}[]:'
      ];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('!@#$%^&*()_+""{}[]');
    });
	
	it('with lots of singles', function() {
      var input = ('akasjdlaksjdlaksjdasdla').split('').map(function(a) { return a + ':'; });
      expect(new pkgInstaller(input).checkInsDep()).toEqual(('akasjdlaksjdlaksjdasdla').split('').join(', '));
    });

    it('with words with spaces', function() {
      var input = [
        'Kitten Service:Camel Caser',
        'Camel Caser:'
      ];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('Camel Caser, Kitten Service');
    });
	
	it('even when a package contains many dependencies', function() {
      var input = [
        'p:',
        'q:p',
        'r:p',
        's:r',
        't:r'
      ];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('p, q, r, s, t');
    });
    
    it('when a inputObj are out of order', function() {
      var input = [
        'b:a',
        'c:b',
        'a:',
      ];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('a, b, c');
    });


  });

  
  describe('will handle duplicates', function() {
    it('when given duplicate inputObj', function() {
      var input = ['p:','q:', 'q:p'];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('a, b');
    });
  });

  describe('checking sample', function() {
    it('expects the first to function', function(){
      var input = [
        'KittenService:CamelCaser',
        'CamelCaser:'
      ];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('CamelCaser, KittenService');
    });

    it('expects the output', function() {
      var input = [
        'KittenService:',
        'Letmeme:Cyberportal',
        'Cyberportal:Ice',
        'CamelCaser:KittenService',
        'Fraudstream:Letmeme',
        'Ice:'
      ];
      expect(new pkgInstaller(input).checkInsDep()).toEqual('KittenService, Ice, Cyberportal, Letmeme, CamelCaser, Fraudstream');
    });
  });
});