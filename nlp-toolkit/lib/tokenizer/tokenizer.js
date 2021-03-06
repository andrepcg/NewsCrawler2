// Generated by CoffeeScript 1.3.3
var Stemmer, Stopwords, Tokenizer;

Stopwords = require('../../stopwords/stopwords.json');

Stemmer = require('porter-stemmer').stemmer;

Tokenizer = (function() {
  var _clean, _config, _punctuationMarks;

  _config = {};

  _punctuationMarks = ["\W"];

  function Tokenizer(config) {
    var key, stopword, value, __getStopwords, __stopwords, _i, _len, _ref, _tempSymbols;
    if (config == null) {
      config = {};
    }
    _config = config;
    __stopwords = [];
    if (_config.stopwords) {
      __getStopwords = function(language) {
        switch (language) {
          case 'german':
            return Stopwords.German;
          case 'english':
            return Stopwords.English;
		  case 'portuguese':
            return Stopwords.Portuguese;
          default:
            return [];
        }
      };
      if (Object.prototype.toString.call(_config.stopwords) === '[object Array]') {
        _ref = _config.stopwords;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stopword = _ref[_i];
          __stopwords = __stopwords.concat(__getStopwords(stopword));
        }
      } else if (_config.stopwords === "all") {
        __stopwords = [].concat.apply([], (function() {
          var _results;
          _results = [];
          for (key in Stopwords) {
            value = Stopwords[key];
            _results.push(value);
          }
          return _results;
        })());
      } else {
        __stopwords = __getStopwords(_config.stopwords);
      }
    }
    _config.stopwords = __stopwords;
    _tempSymbols = [];
    if (_config.cleanSymbols) {
      _tempSymbols = _tempSymbols.concat(_config.cleanSymbols);
    }
    if (!_config.keepPunctuationMarks) {
      _tempSymbols = _tempSymbols.concat(_punctuationMarks);
    }
    if (_tempSymbols.length > 0) {
      _config.cleanRegExp = new RegExp("(" + _tempSymbols.join("|") + ")", "g");
    }
    this;

  }

  _clean = function(token) {

    if (_config.lowerCase) {
      token = token.toLowerCase();
    }
    if (_config.upperCase) {
      token = token.toUpperCase();
    }

    if (_config.cleanRegExp) {

      token = token.replace(/u[0-9]{4}/, "");
      token = token.replace(_config.cleanRegExp, "");
    }
	
    return token;
  };

  Tokenizer.prototype.tokenize = function(text) {
    var row, token, _cleanedSentence, _cleanedToken, _result;
    _result = (function() {
      var _i, _len, _ref, _results;
      _ref = text.split(/\\n+/);
	  
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _cleanedSentence = (function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = row.split(' ');
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            token = _ref1[_j];
            _cleanedToken = _clean(token);
			
            if (!this.isStopword(_cleanedToken.replace("'", "")) && _cleanedToken.length > 0) {
			  if(_config.porter)
				_results1.push(Stemmer(_cleanedToken));
			  else
			    _results1.push(_cleanedToken);
            } else {

            }
          }
		  
          return _results1;
        }).call(this);
        if (_cleanedSentence.length > 0) {
          _results.push(_cleanedSentence);
        } else {

        }
      }
      return _results;
    }).call(this);
    if (_result.length === 1 && _result[0].length === 1) {
      return _result[0][0];
    } else if (_result.length === 1) {
      return _result[0];
    } else {
      return _result;
    }
  };

  Tokenizer.prototype.isStopword = function(token) {
    return -1 < _config.stopwords.indexOf(token);
  };

  return Tokenizer;

})();

module.exports = Tokenizer;
