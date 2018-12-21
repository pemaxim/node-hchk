'use strict';

Object.defineProperties( module.exports, {

  Client: {
    value: function ( apiKey ) {
      let Client = require( './client.js' );
      return new Client( apiKey );
    },
    enumerable: true,
    writable: true
  },

  version: {
    value: 0.1,
    writable: false
  }

});