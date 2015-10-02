function postTest(){
console.log("postTest");

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
var auth = btoa('2:2');
function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
};


$.ajax
({
  type: 'POST',
  url: 'http://interfacepro-1038.appspot.com/competitionEvent',
  dataType: 'jsonp',
  async: false,
  data: info,
  beforeSend: function (xhr){
      xhr.setRequestHeader('Authorization', make_base_auth('2', '2'));
      xhr.setRequestHeader("Content-Type","application/json");

  },
  success: function (){
    alert('success');
  }
});


}
