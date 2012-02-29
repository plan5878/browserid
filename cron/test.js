#!/usr/local/bin/node

process.chdir('/home/app/code/locale/');

var mongodb = require('mongodb'),
    cache = require('./lib/cache');

cache.locales(function (err, locales) {
  console.log('list locales', locales);
});