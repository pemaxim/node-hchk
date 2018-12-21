'use strict';

var debug = require('debug')('hchkClient'),
    _ = require('lodash');

const _request = Symbol('request');

module.exports = class hchkClient {

  /**
   *
   * @param apiKey
   */
  constructor( apiKey ) {
    this.apiKey = apiKey;
  }

  /**
   * Get a list of existing checks
   * Documentation: https://healthchecks.io/docs/api/#list-checks
   *
   * @param cb
   */
  listChecks(cb) {
    debug( 'listChecks' );
    this[_request]( 'checks/', {
      "method": "GET"
    }, function(err, body){
      if(err) {
        return cb(err);
      }
      if(_.get(body,'checks')) {
        let checks = _.map( _.get(body,'checks', []), function(check){
          return _.extend( {
            "uuid": (_.get(check,'update_url','')).replace('https://healthchecks.io/api/v1/checks/','')
          }, check );
        } );
        _.set(body,'checks',checks)
      }
      cb(err, body);
    } );
  }

  /**
   * Create a new check
   * Documentation: https://healthchecks.io/docs/api/#create-check
   *
   * @param data
   * @param cb
   */
  createCheck(data, cb) {
    debug( 'createCheck' );

    // Parses tags and covert them to valid format if needed.
    let tags = _.get(data,'tags');
    if(tags && Array.isArray(tags)) {
      _.set(data,'tags', tags.join(" "));
    } else if(tags && typeof tags == 'string' && tags.indexOf(',') >= 0) {
      tags = tags.split(',');
      tags = _.map(tags,function(i){return i.trim()});
      _.set(data,'tags', tags.join(" "));
    }

    this[_request]( 'checks/', {
      "method": "POST",
      "body": JSON.stringify(data),
    }, function(err,body) {
      if(err) {
        return cb(err);
      }
      cb(err, _.extend( {
        "uuid": (_.get(body,'update_url','')).replace('https://healthchecks.io/api/v1/checks/','')
      }, body || {} ));
    } );
  }

  /**
   * Ping check
   *
   * @param data
   * @param cb
   */
  pingCheck(uuid, cb) {
    debug( 'pingCheck' );
    let _package = require('../package.json');
    require('request')( {
      url: 'https://hc-ping.com/' + uuid,
      headers: {
        "User-Agent": _package.name + '/' + _package.version + ' Nodejs API Client for healthchecks.io'
      }
    }, function(err, response, body){
      if(err || body !== "OK") {
        return cb(err || new Error("Invalid response from healthchecks.io"));
      }
      cb();
    } );
  }

  /**
   * Update an existing check
   * Documentation: https://healthchecks.io/docs/api/#update-check
   *
   * @param uuid
   * @param data
   * @param cb
   */
  updateCheck(uuid, data, cb) {
    debug( 'updateCheck' );

    // Parses tags and covert them to valid format if needed.
    let tags = _.get(data,'tags');
    if(tags && Array.isArray(tags)) {
      _.set(data,'tags', tags.join(" "));
    } else if(tags && typeof tags == 'string' && tags.indexOf(',') >= 0) {
      tags = tags.split(',');
      tags = _.map(tags,function(i){return i.trim()});
      _.set(data,'tags', tags.join(" "));
    }

    this[_request]( 'checks/' + uuid, {
      "method": "POST",
      "body": JSON.stringify(data),
    }, function(err,body) {
      if(err) {
        return cb(err);
      }
      cb(err, _.extend( {
        "uuid": (_.get(body,'update_url','')).replace('https://healthchecks.io/api/v1/checks/','')
      }, body || {} ));
    } );

  }

  /**
   * Pause monitoring of a check
   * Documentation: https://healthchecks.io/docs/api/#pause-check
   *
   * @param uuid
   * @param cb
   */
  pauseCheck(uuid, cb) {
    debug( 'pauseCheck' );

    this[_request]( 'checks/' + uuid + '/pause', {
      "method": "POST"
    }, function(err,body) {
      if(err) {
        return cb(err);
      }
      cb(err, _.extend( {
        "uuid": (_.get(body,'update_url','')).replace('https://healthchecks.io/api/v1/checks/','')
      }, body || {} ));
    } );
  }

  /**
   * Delete check
   * Documentation: https://healthchecks.io/docs/api/#delete-check
   *
   * @param uuid
   * @param cb
   */
  deleteCheck(uuid, cb) {
    debug( 'deleteCheck' );
    this[_request]( 'checks/' + uuid, {
      "method": "DELETE"
    }, cb );
  }

  /**
   * Get a List of Existing Integrations
   * Documentation: https://healthchecks.io/docs/api/#list-channels
   *
   * @param cb
   */
  listChannels(cb) {
    debug( 'listChannels' );
    this[_request]( 'checks/', {
      "method": "GET"
    }, cb );
  }

  /**
   * Private method.
   * Does request to healthchecks.io API
   *
   * @param method
   * @param options
   * @param cb
   */
  [_request]( method, options, cb ) {
    let url = "https://healthchecks.io/api/v1/" + method;

    _.defaults( options || {}, {
      "method": "GET",
      "uri": url,
      "headers": {
        "X-Api-Key": this.apiKey
      }
    } );

    require( 'request')( options, function( err, response, body ){
      if(err) {
        return cb(err);
      }
      try {
        body = JSON.parse(body);
      } catch(e) {
        return cb(new Error("Invalid response from healthchecks.io"));
      }
      if(_.get(body,'error')) {
        return cb(new Error(_.get(body,'error')));
      }
      cb(null, body);
    } );

  }

}