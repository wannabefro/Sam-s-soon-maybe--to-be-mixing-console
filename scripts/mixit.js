window.onload = init;
var context;
var bufferLoader;
var counter = 0;
var tracks = [];

function init() {
  context = new webkitAudioContext();
  play();
}

function play() {
  bufferLoader = new BufferLoader(
    context,
    [
      'audio/drums.ogg',
      'audio/piano.ogg',
      'audio/bass.ogg',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // var source1 = context.createBufferSource();
  // gain1 = context.createGainNode();
  // source1.buffer = bufferList[0];
  // mute(gain1);

  // source1.connect(gain1);
  // gain1.connect(context.destination);
  // source1.noteOn(0);
  $("#add").click(function(){
    makeSource(bufferList);
  });
  $("#play").click(function(){
    for (var i = 0; i < tracks.length; i++){
      eval("window.source" + i + ".noteOn(0)");
    }
  });
  $("#stop").click(function(){
    for (var i = 0; i < tracks.length; i++){
      eval("window.source" + i + ".noteOff(0)");
    }
  });
}

function mute(unit){
  $(".mute").click(function(){
    console.log(unit);
    unit.gain.value = !unit.gain.value;
  });
}

//changeVolume and loop currently effecting all tracks
function changeVolume(vol){
  $(".volume").change(function(){
  var volume = $( ".volume" ).val();
  vol.gain.value = volume / 100;
  });
}

function loop(looper){
  $('.loop').change(function(){
    if ($(this).is(':checked')){
      looper.loop = true;
    } else {
      looper.loop = false;
    }
  });
}

//FIX VARIABLE NAME CREATION!!!
function makeSource(bufferList){
  //var source = context.createBufferSource();
  //var gain = context.createGainNode();
  //source.buffer = bufferList[counter];
  eval("var source" + counter + "=context.createBufferSource()");
  eval("var gain" + counter + "=context.createGainNode()");
  eval("source" + counter + ".buffer=bufferList[counter]");
  //eval("var source" + counter + "= source");
  //eval("var gain" + counter + "= gain");
  //eval("source" + counter + ".noteOn(0)");
  createButton();
  createVolume();
  createLoop();
  eval("mute(gain" + counter + ")");
  eval("changeVolume(gain" + counter + ")");
  eval("loop(source" + counter +")");
  eval("source" + counter + ".connect(gain" + counter + ")");
  eval("gain" + counter + ".connect(context.destination)");
  eval("tracks.push(source" + counter + ")");
  eval("window.source" + counter +"=source" + counter);
  counter++;

}


function createButton(id){
  $('<button />', {'class': 'mute', text: 'MUTE'}).appendTo('#controls');
}

function createVolume(id){
  $('<input />', {'class': 'volume', 'type': 'range', 'min': '0', 'max': '100', 'value': '100'}).appendTo('#controls');
}

function createLoop(id){
  $('<label />', {text: 'Loop'}).appendTo('#controls');
  $('<input />', {'type': 'checkbox', 'class': 'loop'}).appendTo('#controls');
}


