var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function EntryCtrl($scope) {
  
  $scope.entries = [];
  $scope.today = new Date();


  _.each(_.range(0, 50), function(i) {
    var d = new Date();
    d.setDate($scope.today.getDate()+i);
    $scope.entries.push(new Entry($scope, i == 0 ? $scope.today : d));
  })

};

function Entry($scope, date) {
  this.dateObject = date;
  this.day = days[date.getDay()];
  this.date = date.getDate();
  this.month = months[date.getMonth()];
  this.year = date.getFullYear();
  this.ordinal = ordinal(this.date);
  this.text = '';
}

function ordinal(n) {
   var s=["th","st","nd","rd"],
       v=n%100;
   return (s[(v-20)%10]||s[v]||s[0]);
}