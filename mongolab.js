angular.module('mongolab', ['ngResource']).factory('Entry', function($resource) {


  var Entry = $resource('https://api.mongolab.com/api/1/databases/timepaper/collections/entries5/:id',
      { apiKey: '506225c4e4b0db84a758c9e3' }, {
        update: { method: 'PUT' },
        save: { method: 'POST' }
      }
  );

  Entry.prototype.update = function(cb) {
    console.log(this);
    return Entry.update({id: this._id.$oid},
        angular.extend({}, this, {_id:undefined}), cb);
  };

  Entry.prototype.destroy = function(cb) {
    return Entry.remove({id: this._id.$oid}, cb);
  };


  return Entry;

});