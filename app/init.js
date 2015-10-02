$( document ).ready(function() {
   $(document).foundation(); // responsive design
   initTemplates(); // renders the html templates for displaying everything
    lastDataReceived = new Date().getTime(); // init our timestamp


// subscribe to customer number 2
   var client = new Faye.Client('http://e4d0b2de.fanoutcdn.com/bayeux');
   subscription = client.subscribe('/2', function (data) {
     $('#output').text("event registered...");
     $('#output').text(data);
     console.log("received: "+data);
     var dataJSON = JSON.parse( data );
     var newInfo = analyzeNewEvent(jQuery.parseJSON( data ));
     infoTableUpdateShooter(newInfo.shooterNumber, newInfo);


     lastDataReceived = new Date().getTime(); // update timestamp

 }).then(function() {
  noticeUser("Sie haben den Ticker erfolgreich aktiviert.")
//  checkWhetherToUnsubscribe();
   console.log("Sub: "+JSON.stringify(subscription));
});
}); // ready
