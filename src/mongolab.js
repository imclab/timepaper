angular.module('mongolab', ['ngResource']).factory('Entry', function($resource) {

  return function defineEntry(table) {

    var Entry = $resource('https://api.mongolab.com/api/1/databases'+
      '/timepaper/collections/'+table+'/:id',

      { apiKey: '506225c4e4b0db84a758c9e3' }, {
        update: { method: 'PUT' },
        save: { method: 'POST' }
      }
      
      );

    Entry.prototype.update = function(cb) {
      return Entry.update({id: this._id.$oid},
        angular.extend({}, this, {_id:undefined}), cb);
    };

    Entry.prototype.destroy = function(cb) {
      return Entry.remove({id: this._id.$oid}, cb);
    };

    return Entry;

  }

});