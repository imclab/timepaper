angular.module('mongolab', ['ngResource']).factory('Entry', function($resource) {

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var _Entry = $resource('https://api.mongolab.com/api/1/databases' +
      '/angularjs/collections/entries/:id',
      { apiKey: '506225c4e4b0db84a758c9e3' }, {
        update: { method: 'PUT' },
        save:   {method:'POST'}
      }
  );

  var Entry = function(date) {
    this.dateObject = date;
    this.day = days[date.getDay()];
    this.date = date.getDate();
    this.month = months[date.getMonth()];
    this.year = date.getFullYear();
    this.ordinal = ordinal(this.date);
    this.text = '';
  };

  // teehee
  angular.extend(Entry, _Entry);

  Entry.prototype.update = function(cb) {
    return Entry.update({id: this._id.$oid},
        angular.extend({}, this, {_id:undefined}), cb);
  };

  Entry.prototype.destroy = function(cb) {
    return Entry.remove({id: this._id.$oid}, cb);
  };

  window.e = Entry;

  return Entry;

});