var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    util = require('util'),

    mongodb = require('mongodb');

const locale_dir = '/home/app/code/locale';

var execErrorOr = function (cb) {
  return function (error, stdout, stderr) {
    if (error) {
      console.error('ERROR: ' + error);
      console.error(stderr);
      console.log('FINISHED ', new Date());
      process.exit(1);
    }
    cb(stdout);
  };
}

exports.locales = function (cb) {
    fs.readdir(locale_dir, function (err, files) {
        var len = files.length,
          counter = len,
        locales = {},
            collectMTimes = function (file) {
              if (['.', '..',  'templates', '.svn'].indexOf(file) != -1) {
                    counter--;
            } else {
                    fs.stat(path.resolve(path.join(locale_dir, file)), function (err, stats) {
                        counter--;
                    if (err) {

                       } else if (stats.isDirectory()) {
                  counter += 2;                            
                      fs.stat(path.resolve(path.join(locale_dir, file, 'LC_MESSAGES/client.po')), checkMTime(file));
                      fs.stat(path.resolve(path.join(locale_dir, file, 'LC_MESSAGES/messages.po')), checkMTime(file));
                  }

                        //console.log(file, counter);
                       if (counter == 0) {
                        compareLastRun(locales);
                    }
              });
            }           
        },
        checkMTime = function (locale) {
            return function (err, stats) {
                counter--;
                if (err) {
                    console.error('ERROR checkMTime: ', err);
                    process.exit(1);
                }            
                if (! locales[locale] || locales[locale].mtime < stats.mtime) {
                    if (!locales[locale]) locales[locale] = {};
                    locales[locale].mtime = stats.mtime;
                }
                if (counter == 0) {
                    compareLastRun(locales);
                }
            }
        },
        compareLastRun = function (locales) {
              // if (dirty_locales.indexOf(locale) == -1) dirty_locales.push(locale);
           getPrevious(locales);
        },
        getPrevious = function (locales) {
              var prev = null,
              client = new mongodb.Db('l10n-updater', new mongodb.Server('127.0.0.1', 27017, {}));

              client.open(function (err, p_client) {
                  client.collection('mtimes', function (err, collections) {
                      collections.find().toArray(function (err, results) {
                      var criteria = {};
                     // get or create
                     if (results.length == 0) {
                        //prev is still null;
                      rebuild(null, locales);
locales[locale].mtime = stats.mtime;
            }
                    if (counter == 0) {
                    compareLastRun(locales);
		    }
			  });
		      });
		  });
	},
        compareLastRun = function (locales) {
              // if (dirty_locales.indexOf(locale) == -1) dirty_locales.push(locale);
           getPrevious(locales);
        },
        getPrevious = function (locales) {
              var prev = null,
              client = new mongodb.Db('l10n-updater', new mongodb.Server('127.0.0.1', 27017, {}));

              client.open(function (err, p_client) {
                  client.collection('mtimes', function (err, collections) {
                      collections.find().toArray(function (err, results) {
                      var criteria = {};
                     // get or create
                     if (results.length == 0) {
                        //prev is still null;
                     } else {
                        rebuild(results[0], locales);
                     }
                     collections.update(criteria,
                         locales,
                         {safe: true, upsert: true},
                         function (err) {
                             if (err) 
                                 console.error('Unable to update mongodb', err);
                          });
		     
			  });
		      });
          });
        }, // getPrevious
           rebuild = function (oldMTimes, newMTimes) {
            if (oldMTimes) {
		var locales = [];
		for (var locale in newMTimes) {
		    if (oldMTimes[locale] && newMTimes[locale] && oldMTimes[locale].mtime < newMTimes[locale].mtime) {
			locales.push(locale);
		    } else if (!oldMTimes[locale]) {
			locales.push(locale);
		    }
		}
                compress(locales);
            } else {
                rebuildAll();
            }
        
        },
        rebuildAll = function (mTimes) {
            var locales = [];
            for (var locale in mTimes) {
                locales.push(locale);
            }
            compress(locales);
        },
        compress = function (locales) {
            /* Make a config file like
  { "supported_languages": [
    "af", "ca", "cs","de", "el", "en-US", "eo", "es", "es-MX", "et", "eu",
    "fi", "fr", "fy", "ga", "gd", "gl", "hr", "it", "ja", "lij", "lt",
    "ml", "nl", "pl", "pt", "pt-BR", "rm", "ro", "ru", "sk", "sl", "son",
    "sq", "sr", "tr", "zh-CN", "zh-TW",
    "it-CH", "db-LB"
  ] }
	    */
            var newConf = {supported_languages: locales};
	    if (locales.length == 0) {
		console.log("No updates");
		cb(null, locales);
		process.exit(0);
	    }
            fs.writeFile('/tmp/compress.json', JSON.stringify(newConf), function (err) {
		    if (err) { 
			console.error(err); process.exit(1); 
		    } else {
			exec('CONFIG_FILES=/tmp/compress.json ../scripts/compress-locales.sh . ../resources/static/i18n/', function (error, stdout, stderr) {
                            if (error) {
				console.error('ERROR: ' + error);
				console.error(stderr);
				console.log('FINISHED ', new Date());
				process.exit(1);
			    }
		            console.log(stdout);
                            console.log('FINISHED ', new Date());
			    exec('forever restartall', execErrorOr(function (stdout) {
			        console.log(stdout);
                                cb(error, locales);
                                process.exit(0);
		            }));                            
                        }); // compress-locales.sh			
		    }
            });            
        };
        files.forEach(collectMTimes);
    });
};

