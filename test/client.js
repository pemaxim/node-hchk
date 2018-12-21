/**
 * Basic Tests
 *
 *
 */

var _ = require('lodash'),
    async = require('async');

module.exports = {

  'before': function( done ) {
    const HCHK_KEY = process.env.HCHK_KEY || null;
    module.exports.checks = [];
    module.exports.check = null;
    module.exports.client = require( '../src/index.js' ).Client( HCHK_KEY );
    done();
  },

  'Client method': {

    'listChecks (Get a list of existing checks)': function ( done ) {

      this.timeout( 30000 );

      module.exports.client.listChecks( function(err, body){
        should.not.exist(err);
        should.exist(body);

        body.should.have.property( 'checks' );
        body.checks.should.be.instanceof(Array);

        module.exports.checks = body.checks;

        done();
      } );

    },

    'createCheck (Create a new check)': function ( done ) {

      this.timeout( 30000 );

      let params = {
        "name": "My Test Check",
        "tags": [
          "hello",
          "world"
        ],
        "timeout": 3600,
        "grace": 3600,
        "channels": "*"
      }

      module.exports.client.createCheck( params, function(err, body){
        should.not.exist(err);
        should.exist(body);

        body.should.have.property( 'name', 'My Test Check' );
        body.should.have.property( 'tags', 'hello world' );

        module.exports.check = body;

        done();
      } );

    },

    'pingCheck (Ping existing check)': function ( done ) {

      this.timeout( 30000 );

      let uuid = _.get( module.exports, 'check.uuid' );

      uuid.should.not.be.empty();

      if( !uuid ) {
        return done();
      }

      module.exports.client.pingCheck( uuid, function(err){
        should.not.exist(err);

        done();
      } );

    },

    'updateCheck (Update an existing check)': function ( done ) {

      this.timeout( 30000 );

      let params = {
        "name": "My Updated Test Check"
      }

      let uuid = _.get( module.exports, 'check.uuid' );

      uuid.should.not.be.empty();

      if( !uuid ) {
        return done();
      }

      module.exports.client.updateCheck( uuid, params, function(err, body){
        should.not.exist(err);
        should.exist(body);

        body.should.have.property( 'name', 'My Updated Test Check' );
        body.should.have.property( 'tags', 'hello world' );

        module.exports.check = body;

        done();
      } );

    },

    'pauseCheck (Pause monitoring of a check)': function ( done ) {

      this.timeout( 30000 );

      let uuid = _.get( module.exports, 'check.uuid' );

      uuid.should.not.be.empty();

      if( !uuid ) {
        return done();
      }

      module.exports.client.pauseCheck( uuid, function(err, body){
        should.not.exist(err);
        should.exist(body);

        body.should.have.property( 'name', 'My Updated Test Check' );
        body.should.have.property( 'status', 'paused' );

        done();
      } );

    },

    'deleteCheck (Delete check)': function ( done ) {

      this.timeout( 30000 );

      let uuid = _.get( module.exports, 'check.uuid' );

      uuid.should.not.be.empty();

      if( !uuid ) {
        return done();
      }

      module.exports.client.deleteCheck( uuid, function(err, body){
        should.not.exist(err);
        should.exist(body);

        body.should.have.property( 'name', 'My Updated Test Check' );

        done();
      } );

    },

    'listChannels (Get a list of existing integrations)': function ( done ) {

      this.timeout( 30000 );

      module.exports.client.listChannels( function(err, body){
        should.not.exist(err);
        should.exist(body);

        done();
      } );

    }

  },

  'after': function( done ) {
    async.eachLimit( module.exports.checks, 3, function(check, next){
      if( _.get( check, 'tags' ) == 'hello world' ) {
        module.exports.client.deleteCheck( _.get( check, 'uuid' ), function(){
          next();
        } );
      } else {
        next();
      }
    }, function(){
      done();
    } );
  },

};
