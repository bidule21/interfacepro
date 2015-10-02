/*QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
*/
QUnit.module( "Integration Tests" );
QUnit.skip('Find ISSF ID by Name', function(assert) {
    assert.expect(1);

    var promise = findIssfIdByName("Sidi", "Peter");

    // return the `then` and not the original promise.
    return promise.then(function(issfid) {
        assert.ok(issfid == "SHHUNM1109197801", "Passed!");
    });

});
QUnit.skip('Find ISSF Info by ID', function(assert) {
    assert.expect(1);

    var promise = findIssfInfoLightByIssfId("SHHUNM1109197801");

    // return the `then` and not the original promise.
    return promise.then(function(data) {
        assert.ok(data.name == "SIDI", "Passed!");
    });

});
/*
QUnit.test('Find ISSF Info by Name', function(assert) {
    assert.expect(1);

    var data = findIssfInfoLightByName("Sidi","Peter");

    // return the `then` and not the original promise.

        assert.ok(data.name == "SIDI", "Passed!");


});
*/
QUnit.skip('findImageViaGoogle', function(assert) {
    assert.expect(1);
    var firstNameToFind ="Peter";
    var nameToFind ="Sidi";
    var promise =   findImageViaGoogle(firstNameToFind+" "+nameToFind+" site:dsb.de",1)

    // return the `then` and not the original promise.
    return promise.then(function(data) {

    var imgUrl = data.responseData.results[0].url;
        assert.ok(data.responseStatus == 200, "Passed! Found image at URL: "+imgUrl);
    });

});



QUnit.module( "Helper Function Tests" );
QUnit.test("Get Color", function(assert){

  var data = simulateEvent();
  var RingData = data["Data"]["RingData"];
  var colorArray = RingData[0].FillColor;

  var rgba =  getColor(colorArray);

  assert.ok(rgba == "rgb(31,31,31)");

});

QUnit.test("Anaylze New Event", function(assert){

  var data = simulateEvent();
  var newInfo =  analyzeNewEvent(data);

  assert.ok(newInfo.name=="Mustermann");
  assert.ok(newInfo.prename=="Peter");
  assert.ok(newInfo.seriesResults[0]== "65.5");
  assert.ok(newInfo.shotNumber=="40");
  assert.ok(newInfo.hitValue=="7.6");
  assert.ok(newInfo.total=="251.2");
  assert.ok(newInfo.shooterNumber=="2");
});

QUnit.test("init Template", function(assert){
  initTemplates();

  assert.ok(Templates.shooterInfo.source != "","Template source shooterInfo not empty");

})

QUnit.module( "UI Rendering Tests" );
QUnit.test("Draw Target (air rifle)", function(assert){
  /* test air rifle target */
  var info = simulateEvent();
  var canvas = $('<canvas />').attr({
                      id: "testCanvas",
                      width: 480,
                      height: 480
                  });

  var fixture = $( "#qunit-fixture" );
  fixture.append( canvas );
  var target = drawTarget(info,"#testCanvas");
  testCanvas = target[0];
  assert.pixelEqual(testCanvas, 240, 1, 0,0,0);
  assert.pixelEqual(testCanvas, 240, 240, 31,31,31);
  assert.pixelEqual(testCanvas, 240, 238, 172,172,172);
  assert.pixelEqual(testCanvas, 200, 238, 255,255,255);
  assert.pixelEqual(testCanvas, 240, 450, 16,16,16);
  assert.pixelEqual(testCanvas, 333, 326, 255,255,255);

});
