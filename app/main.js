
$("#simulate").click(function() {
  simulateOneShot();
});
$("#posttest").click(function() {
  postTest();
});

$("#makeTarget").click(function() {

  var info = simulateEvent();
  var target = drawTarget(info, "#canvas");

});

   $("#searchID").click(function() {
    var nameToFind = $("#searchName").val();
    var firstNameToFind = $("#searchFirstName").val();

    noticeUser("searching for "+nameToFind);

    findIssfIdByName(nameToFind, firstNameToFind).done(
         function(IssfId){

           noticeUser("found issf id: "+IssfId);
           findIssfInfoLightByIssfId(IssfId).done(
             function(shooter){

          /*     noticeUser("found shooter info: "+shooter.flagurl);
               noticeUser("found shooter info: "+ shooter.nation); */
               var shooter1 = Templates.shooterInfo(shooter);
               $( "#testdisplay" ).append( shooter1 );
          })

        }
).fail(
    function(){
      noticeUser("Search in ISSF DB unsucessful - searching dsb.de for image: "+nameToFind);
      findImageViaGoogle(firstNameToFind+" "+nameToFind+" site:dsb.de",1).done(
        function(response){
// TODO check for valid response
          var imageurl = response.responseData.results[0].url;


          var shooter = new Object();
          shooter.imageurl = imageurl;
          shooter.imageurl = imageurl;
          shooter.name = nameToFind;
          shooter.prename = firstNameToFind;
          shooter.nation ="GER";
          shooter.flagurl = "";

          var shooter1 = Templates.shooterInfo(shooter);
       //  noticeUser(shooter1);
       $( "#testdisplay" ).append( shooter1 );
        }
      )
    }

  )
  }); // click


// unsubscribe after 5 minutes of inactivity
function checkWhetherToUnsubscribe(){
setInterval(
    (function x() {
    // noticeUser("checkWhetherToUnsubscribe: "+subscription);
      var now = new Date().getTime();
      var testForUnsub = (now - lastDataReceived) / 1000;
      if ( testForUnsub > 300) {
      //  subscription.cancel();
        console.log("we will try to unsubscribe here");
    //    noticeUser("Seit 5 Minuten haben wir keine Daten mehr erhalten. Deshalb wird der Liveticker jetzt abgeschaltet. Falls Sie es später erneut versuchen wollen, laden Sie diese Seite bitte neu.");
      }
        return x;
    })(), 10000);
}

function simulateOneShot(){
  var eventData = simulateEvent(); // get simulated JSON
  analyzeNewEvent(eventData);

};

// checks the JSON event data and calls function to handle it accordingly
// should be bound to the websocket channel, is the main function
// input: eventData the JSON object originally send by the meyton Competition controler
// output: none , calls further functions internally

function analyzeNewEvent(eventData){

  var newInfo = new Object();  // Object stripped down to necessary information

  //TODO TO BE IMPLEMENTED
//  noticeUser("analyzeNewEvent not fully implemented");

// regular shot event -> this is the main case

    newInfo.name=eventData["Data"]["Shooter"]["name"]; // TODO  JSON change required , perhaps use familyname as documented but might be backwards compatibility problems
    newInfo.prename=eventData["Data"]["Shooter"]["prename"];  // TODO Meyton JSON change required to mandatory
    newInfo.seriesResults=eventData["Data"]["ResultTable"]["SeriesResults"];
    newInfo.shotNumber=eventData["Data"]["HitBoxStrings"][0]["No"]; // TODO check with Meyton whether this is a good way to get the current shot
    newInfo.hitValue=eventData["Data"]["HitBoxStrings"][0]["VPT"][0];
//    newInfo.total=eventData["Data"]["ResultTable"]["TotalResult"].substr(3); // TODO check whether it always starts there
    newInfo.total=eventData["Data"]["ResultTable"]["TotalResult"]; // TODO check whether it always starts there
//  get the shooter number from the object and pass it to infoTableUpdateShooter function
    newInfo.shooterNumber= eventData["Data"]["Shooter"]["number"];

    return newInfo;

};

// updates the table row for the shooter, counts new values animated up
// input: shooter no [1-10] , newInfo Object
// newInfo.HitValue
function infoTableUpdateShooter(no, newInfo){
  //TODO POINTS UPDATE TO BE IMPLEMENTED
if (newInfo.shotNumber < 2) {
  for (var i = 1; i < 5; i++) {
    $(".shooter"+no+" .series"+i).text("0"); // init series to 0
  }
}
// just in case... nice for the alpha3 demo
  $(".shooter"+no+" .shooter-name").text(newInfo.name+", "+newInfo.prename);

  // do the  not-animated value changes here
  $(".shooter"+no+" .shot-number").text(newInfo.shotNumber);
  var currentSeries =  Math.ceil( Number(newInfo.shotNumber) / 10);  // round up to the next number
  for (var i = 1; i < currentSeries; i++) {
    $(".shooter"+no+" .series"+i).text(newInfo.seriesResults[i-1]); // replace old series values just in case we missed some events
  }


  // do the cool count ups for the new values
   var hitValueDiv =   $(".shooter"+no+" .hit-value")[0];
   var hitValueAni = new CountUp(hitValueDiv, 0, newInfo.hitValue, 1, 2.5, null); // 1 digit after decimal point ALWAYS, 2.5 seconds to count up
   hitValueAni.start();

   // check whether we need digits after the decimal point for this match
   var digitsToShow = 0; // TODO where to determinate whether to show digits or not?

   // do a count up from the old to the new value
   var serieOldVal =    $(".shooter"+no+" .series"+currentSeries).text().trim();
   var serieNewVal =  newInfo.seriesResults[currentSeries-1]; // is might be series 4 but the array count starts at 0 not 1
   var serieValueDiv =   $(".shooter"+no+" .series"+currentSeries)[0];
   var serieValueAni = new CountUp(serieValueDiv, serieOldVal, serieNewVal, digitsToShow, 2.5, null);
   serieValueAni.start();

   var totalOldVal =  $(".shooter"+no+" .total").text().trim();
   var totalValueDiv =   $(".shooter"+no+" .total")[0];
   var totalValueAni = new CountUp(totalValueDiv, totalOldVal, newInfo.total, digitsToShow, 2.5, null);
   totalValueAni.start();
};


function renderShooterInfo(shooter){
/*
 _.template("hello: <%= name %>");

shooter.prename
shooter.name
shooter.nation
shooter.flagurl
shooter.imageurl
shooter.gender
shooter.yearofbirth
shooter.placeofbirth
shooter.hometown
shooter.club
shooter.startofcompeting
shooter.practisingshootersince
shooter.personalcoach
*/

}

// create global object Templates containig functions to render infos
function initTemplates(){

Templates = {};

  // shooter info object for displaying details
  Templates.shooterInfo = [
      '<div class="wrap"> ',
        '<div class="left">',
            '<img src="<%= imageurl %>" alt="<%= name %>">',
          '</div>',
          '<div class ="right">',
            '<div><strong><%= prename %>&nbsp;<%= name %></strong></div>',
            '<% if (typeof(flagurl) !== "undefined") { %>',  // check for valid variables, templates crash if empty
                '<div><img src="<%= flagurl %>">&nbsp; <%= nation %></div>',
            '<% } %>',  // end of if
          '</div>',
      '</div>'
  ].join("\n");


  // compile them into functions
  for (var t of _.keys(Templates)){
    Templates[t] =  _.template(Templates[t]);
  };
}



function get_gravatar_image_url (email, size, default_image, allowed_rating, force_default)
{
    email = typeof email !== 'undefined' ? email : 'john.doe@example.com';
    size = (size >= 1 && size <= 2048) ? size : 80;
    default_image = typeof default_image !== 'undefined' ? default_image : 'mm';
    allowed_rating = typeof allowed_rating !== 'undefined' ? allowed_rating : 'x';
    force_default = force_default === true ? 'y' : 'n';
    return ("https://secure.gravatar.com/avatar/" + md5(email.toLowerCase().trim()) + "?size=" + size + "&default=" + encodeURIComponent(default_image) + "&rating=" + allowed_rating + (force_default === 'y' ? "&forcedefault=" + force_default : ''));
}


// combination function to get light info by name
// TODO FIX to take firstname as well
function findIssfInfoLightByName(name, firstname) {
  findIssfIdByName(name, firstname).done(
       function(IssfId){
         findIssfInfoLightByIssfId(IssfId).done(
           function(shooter){
              return shooter;
           }
         )
});
}

// expects string as input and displays it on the screen
function noticeUser(content){
  new jBox('Notice', {
    content: content,
    color: 'blue'
  });
 }

/* expects name as string , e.g. Anton%20Meier */
/* returns a promise resolves to an string containing the first found issf id  */
function findIssfIdByName(name, firstName) {
 var IssfIdPromise = $.Deferred();
    var xmlSource ='http://www.issf-sports.org/_iphone/?type=shootersearch&name=' + name;

    // build the yql query. Could be just a string - I think join makes easier reading
    var yqlURL = [
        "http://query.yahooapis.com/v1/public/yql",
        "?q=" + encodeURIComponent("select * from xml where url='" + xmlSource + "'"),
        "&format=xml&callback=?"
    ].join("");

    // Now do the AJAX heavy lifting
    $.getJSON(yqlURL, function(data){
        xmlContent = $(data.results[0]);
        // find only the first (best) match
        var foundFirstName = $(xmlContent).find("firstName").first().text();

        // take the issfid only if firstname matches
        if (foundFirstName.toLowerCase().trim() === firstName.toLowerCase().trim()){
          var issfid = $(xmlContent).find("issfid").first().text();
        }
        if (_.isEmpty(issfid) === false) {
          IssfIdPromise.resolve(issfid);
        }else{
          IssfIdPromise.reject(data);
        }
        }).fail(function(data) {
          IssfIdPromise.reject(data);
    }).error(function(data) {
      IssfIdPromise.reject(data);
});
  return IssfIdPromise.promise();
}

/* expects IssfID as string , e.g. SHGERW2901197101 */
/* returns a promise resolves to an user object  */
function findIssfInfoLightByIssfId(IssfID) {

var IssfInfoPromise = $.Deferred();
  var xmlSource ='http://www.issf-sports.org/_iphone/?type=shooterdetail&elementid=' + IssfID;

  // build the yql query. Could be just a string - I think join makes easier reading
  var yqlURL = [
      "http://query.yahooapis.com/v1/public/yql",
      "?q=" + encodeURIComponent("select * from xml where url='" + xmlSource + "'"),
      "&format=xml&callback=?"
  ].join("");

  // Now do the AJAX heavy lifting
  $.getJSON(yqlURL, function(data){
      xmlContent = $(data.results[0]);
      var IssfInfoLight = new Object();

      IssfInfoLight.issfid = $(xmlContent).find("issfid").text();
      if (_.isEmpty(IssfInfoLight.issfid) === false) {

        IssfInfoLight.prename = $(xmlContent).find("prename").text();
        IssfInfoLight.name = $(xmlContent).find("name").text();
        IssfInfoLight.nation = $(xmlContent).find("nation").text();
        IssfInfoLight.flagurl = $(xmlContent).find("flagurl").text();
        IssfInfoLight.imageurl = $(xmlContent).find("imageurl").text();
        IssfInfoLight.imageurl= IssfInfoLight.imageurl.substr(0,IssfInfoLight.imageurl.indexOf('&width')); // cut the width heigth crap
        IssfInfoLight.gender = $(xmlContent).find("gender").text();
        IssfInfoLight.yearofbirth = $(xmlContent).find("yearofbirth").text();
        IssfInfoLight.placeofbirth = $(xmlContent).find("placeofbirth").text();
        IssfInfoLight.hometown = $(xmlContent).find("hometown").text();
        IssfInfoLight.club = $(xmlContent).find("club").text();
        IssfInfoLight.startofcompeting = $(xmlContent).find("startofcompeting").text();
        IssfInfoLight.practisingshootersince = $(xmlContent).find("practisingshootersince").text();
        IssfInfoLight.personalcoach = $(xmlContent).find("personalcoach").text();

        IssfInfoPromise.resolve(IssfInfoLight);
      }else{
        console.log("issf info not found");
        IssfInfoPromise.reject(data);
      }
      }).fail(function(data) {
        IssfInfoPromise.reject(data);
  }).error(function(data) {
    IssfInfoPromise.reject(data);
});
return IssfInfoPromise.promise();
}

/* expects IssfID as string , e.g. SHGERW2901197101 */
/* returns a promise resolves to an user object  */
/* not yet implemented, idea is to parse the issf website */
function findIssfInfoByIssfId(IssfID) {

  // TODO function not yet implemented

// http://www.issf-sports.org/athletes/athlete.ashx?personissfid=SHGERW2901197101
    var IssfInfoPromise = $.Deferred();
    IssfInfoPromise.reject(data);

    return IssfInfoPromise.promise();
}

/* fall back function if no issf data is to be found , uses google as a helper */

  function findImageViaGoogle(search, position) {
  var findImageViaGooglePromise = $.Deferred();
	$.ajax({
		url: 'https://ajax.googleapis.com/ajax/services/search/images',
		dataType: "jsonp",
		data: {
			v: "1.0",
			rsz: 1,
			hl: "pl",
			start: position,
			q: search
		},
		success: function(response) {
			if (response.responseData === null) {
            findImageViaGooglePromise.reject(response);
			} else {
        if (_.isEmpty(response.responseData.results) === true){
              findImageViaGooglePromise.reject(response);
        }else{
// this is the success
			     findImageViaGooglePromise.resolve(response);
         }
			}
		},
    error: function(respone) {
      findImageViaGooglePromise.reject(response);
    }
	});

     return findImageViaGooglePromise.promise();
}


// helper function for creating targets
function getColor(colorArray) {
   // var rgba = "(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + "," + colorArray[3] + ")";
    var rgba = "rgb(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + ")";
    return rgba;
}

// generates targets
// input info["Data"]["RingData"]
//
function drawTarget(info, selector) {

//    $("body").append('<canvas id="canvas" class="targetCanvas" width="480" height="480" style="display:block;"></canvas>' );

    var RingData = info["Data"]["RingData"];
    var radius;
    var LineColor;
    var strokeColor;
    var backgroundColor;
    var FillColor;
    var Radius1;
    var Radius2;
    var FontposX;
    var FontColor;
    var FontPos;
    var x;
    var y;

    // first, find the diameter of the target by looking for the value 1
    // make it look nice , shadow...
    for (var i = 0; i < RingData.length; i++) {
        if (RingData[i].Value == 1 && typeof RingData[i].Value != 'undefined') {

            Radius1 = RingData[i].Diameter / 20;
        var myCanvas =   $(selector);
        $(myCanvas).drawArc({
                strokeStyle: "black",
                fillStyle: "white",
                strokeWidth: 1,
                addLayer: true,
                x: 240, y: 240,
                radius: RingData[i].Diameter / 20,
                    shadowColor: '#000',
                    shadowBlur: 15,
                    shadowX: 0, shadowY: 0,
            });
        }
        if (RingData[i].Value == 2 && typeof RingData[i].Value != 'undefined') {

            Radius2 = RingData[i].Diameter / 20;

        }

    }

    //
    FontposX = Radius1 - Radius2;


    // draw the target
    for (var i = 0; i < RingData.length; i++) {

        radius = RingData[i].Diameter / 20; // smaller and radius
        LineColor = RingData[i].LineColor;
        FillColor = RingData[i].FillColor;

        // find border color
        if (typeof LineColor != 'undefined') {
            strokeColor = getColor(LineColor);
        }
        else {
            strokeColor = '';
        }


        // find fill color
        if (typeof FillColor != 'undefined') {
            backgroundColor = getColor(FillColor);
        }
        else {
            backgroundColor = 'transparent';
        }

        if (RingData[i].Type == "black") {
            backgroundColor = "#707070";
        }

        if (RingData[i].Value == 2 && typeof RingData[i].Value != 'undefined') {

            Radius2 = RingData[i].Diameter / 20;

        }

        // write something?
        if (typeof RingData[i].Value != 'undefined') {
            /*
            "Value": 6,
        "ValuePosition": [0, 90, 180, 270],
        "ValueColor": [255, 255, 255, 255]
        */

            FontColor = getColor(RingData[i].ValueColor);
            FontPos =  RingData[i].ValuePosition;
          //  "ValuePosition": [0, 90, 180, 270],
            for (var j = 0; j < FontPos.length; j++) {

                switch (FontPos[j]) {
                    case 0:
                        x = 240;
                        y = Radius1 - radius + FontposX;
                        break;
                    case 90:
                        y = 240;
                        x = radius + FontposX + Radius2;
                        break;

                    case 270:
                        y = 240;
                        x = Radius1 - radius + FontposX;
                        break;
                    case 180:
                        x = 240;
                        y =radius + FontposX +Radius2;
                        break;
                    default:
                        break;
                }

        $(myCanvas).drawText({
                    fillStyle: FontColor,
                    strokeStyle: FontColor,
                    strokeWidth: 1,
                    x: x,
                    y: y,
                    fontSize: FontposX * 2 / 3,
                    fontFamily: 'Arial',
                    text: RingData[i].Value,
                    fromCenter: true
                });
            }

        }

        // do we need to draw a circle
        if (radius > 0) {

                $(myCanvas).drawArc({
                    strokeStyle: strokeColor,
                    fillStyle: backgroundColor,
                    strokeWidth: 2,
                    x: 240  , y: 240,
                    radius: radius
                });
        }
    }
    return  $(myCanvas);

    // save canvas image as data url (png format by default)
//   $('<img>').attr('src', $('#canvas')[0].toDataURL('image/png')).appendTo($('#canvasImg').empty());

 //   $('#canvasImg').css('background-image', 'url(' + $('#canvas')[0].toDataURL('image/png') + ')');
}

function simulateEvent() {
    var info =
    {
        "Prot": "MEWS",
        "VerP": "00000100",
        "SubProt": "TD",
        "VerSP": "00000000",
        "SeqNo": 1290,
        "Cmd": "TargetData",
        "Data": {
            "Shooter": {
                "name": "Mustermann",
                "prename": "Peter",
                "number":2
           },
            "Lane": {
                "No": 232,
                "ColorBg": [0, 0, 255, 255],
                "ColorFg": [255, 255, 255, 255]
            },
            "ResultTable": {
                "MatchTitle": "ISSF AR Men",
                "AimingTitle": "Competition",
                "TotalResult": "251.2",
                "SeriesResults": ["65.5", "65.7", "58.5", "61.5"],
                "AverageHitValue": "6.28",
                "IPTarget": "192.168.2.132",
                "PresentationMode": 1
            },
            "TargetData": {
                "ZoomLevel": 1,
                "ProbeTriangle": 0,
                "HitsPerTarget": 5
            },
            "RingData": [
              {
                  "Type": "Black",
                  "Diameter": 3050,
                  "FillColor": [31, 31, 31, 255]
              },
              {
                  "Type": "InnerTen",
                  "Diameter": -50,
                  "LineColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 4550,
                  "LineColor": [0, 0, 0, 255],
                  "Value": 1,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [0, 0, 0, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 4050,
                  "LineColor": [0, 0, 0, 255],
                  "Value": 2,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [0, 0, 0, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 3550,
                  "LineColor": [0, 0, 0, 255],
                  "Value": 3,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [0, 0, 0, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 3050,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 4,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 2550,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 5,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 2050,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 6,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 1550,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 7,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 1050,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 8,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 550,
                  "LineColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 50,
                  "LineColor": [255, 255, 255, 255]
              }
            ],
            "HitData": {
                "Caliber": 450,
                "HitValues": [
                  {
                      "No": 36,
                      "XY": [-713, -983],
                      "GC": [[0, 0, 0, 255], [255, 255, 255, 255]]
                  },
                  {
                      "No": 37,
                      "XY": [-219, -1000],
                      "GC": [[0, 0, 0, 255], [255, 255, 255, 255]]
                  },
                  {
                      "No": 38,
                      "XY": [-1037, -1311],
                      "GC": [[0, 0, 0, 255], [255, 255, 255, 255]]
                  },
                  {
                      "No": 39,
                      "XY": [829, 463],
                      "GC": [[0, 0, 0, 255], [255, 255, 255, 255]]
                  },
                  {
                      "No": 40,
                      "XY": [813, 180],
                      "GC": [[255, 0, 255, 255], [255, 255, 255, 255]]
                  }
                ],
                "HitFocus": [-65, -530],
                "HitCircle": [-104, -424, 1512]
            },
            "HitBoxColumnTitles": ["Treffer", "Wert", "Lage"],
            "HitBoxStrings": [
              {
                  "No": 40,
                  "Angle": 0.217887,
                  "VPT": ["7.6"],
                  "VPTA": "N"
              },
              {
                  "No": 39,
                  "Angle": 0.509349,
                  "VPT": ["7.2"],
                  "VPTA": "N"
              },
              {
                  "No": 38,
                  "Angle": -2.240025,
                  "VPT": ["4.3"],
                  "VPTA": "N"
              },
              {
                  "No": 37,
                  "Angle": -1.786393,
                  "VPT": ["6.9"],
                  "VPTA": "N"
              },
              {
                  "No": 36,
                  "Angle": -2.198321,
                  "VPT": ["6.1"],
                  "VPTA": "N"
              },
              {
                  "No": 35,
                  "Angle": -0.649071,
                  "VPT": ["3.6"],
                  "VPTA": "N"
              },
              {
                  "No": 34,
                  "Angle": 1.187579,
                  "VPT": ["7.4"],
                  "VPTA": "N"
              },
              {
                  "No": 33,
                  "Angle": 2.756751,
                  "VPT": ["4.6"],
                  "VPTA": "N"
              },
              {
                  "No": 32,
                  "Angle": -1.120917,
                  "VPT": ["8.9"],
                  "VPTA": "N"
              },
              {
                  "No": 31,
                  "Angle": -2.444147,
                  "VPT": ["4.9"],
                  "VPTA": "N"
              }
            ],
            "ChangedStatus": {}
        }
    };
    return info;
}
function simulateEvent2() {
    var info =
    {
        "Prot": "MEWS",
        "VerP": "00000100",
        "SubProt": "TD",
        "VerSP": "00000000",
        "SeqNo": 1290,
        "Cmd": "TargetData",
        "Data": {
            "Shooter": {
                "name": "Mustermann",
                "prename": "Peter",
                "number": "2"
           },

          "ResultTable": {
                "MatchTitle": "Testmatch",
                "AimingTitle": "Competition",
                "TotalResult": "S4: 251.2",
                "SeriesResults": ["65.5", "65.7", "58.5", "61.5"]
            },
            "TargetData": {
                "ZoomLevel": 1,
                "ProbeTriangle": 0,
                "HitsPerTarget": 5
            },
            "RingData": [
              {
                  "Type": "Black",
                  "Diameter": 3050,
                  "FillColor": [31, 31, 31, 255]
              },
              {
                  "Type": "InnerTen",
                  "Diameter": -50,
                  "LineColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 4550,
                  "LineColor": [0, 0, 0, 255],
                  "Value": 1,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [0, 0, 0, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 4050,
                  "LineColor": [0, 0, 0, 255],
                  "Value": 2,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [0, 0, 0, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 3550,
                  "LineColor": [0, 0, 0, 255],
                  "Value": 3,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [0, 0, 0, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 3050,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 4,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 2550,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 5,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 2050,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 6,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 1550,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 7,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 1050,
                  "LineColor": [255, 255, 255, 255],
                  "Value": 8,
                  "ValuePosition": [0, 90, 180, 270],
                  "ValueColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 550,
                  "LineColor": [255, 255, 255, 255]
              },
              {
                  "Type": "Ring",
                  "Diameter": 50,
                  "LineColor": [255, 255, 255, 255]
              }
            ],
            "HitData": {
                "Caliber": 450,
                "HitValues": [
                  {
                      "No": 36,
                      "XY": [-713, -983],
                      "GC": [[0, 0, 0, 255], [255, 255, 255, 255]]
                  }
                ],
                "HitFocus": [-65, -530],
                "HitCircle": [-104, -424, 1512]
            },
            "HitBoxColumnTitles": ["Treffer", "Wert", "Lage"],
            "HitBoxStrings": [
              {
                  "No": 40,
                  "Angle": 0.217887,
                  "VPT": ["7.6"],
                  "VPTA": "N"
              }
            ],
            "ChangedStatus": {}
        }
    };

    var test2 =  JSON.stringify(info);
    return test2;
}
