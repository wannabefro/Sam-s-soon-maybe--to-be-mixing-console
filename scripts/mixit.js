window.onload = init;
var context;
var bufferLoader;
var counter = 0;
var tracks = [];
var masterGain;
var tuna;

function init() {
  context = new webkitAudioContext();
  tuna = new Tuna(context);
  play();
}

function play() {
  bufferLoader = new BufferLoader(
    context,
    [
      'audio/drums.ogg',
      'audio/piano.ogg',
      'audio/bass.ogg'
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
  makeMasterFader();
  changeMasterVolume();

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

function mute(unit, id){
  $("#" + id).click(function(){
    console.log(unit);
    unit.gain.value = !unit.gain.value;
  });
}

//changeVolume and loop currently effecting all tracks
function changeVolume(vol, id){
  $("#" + id).change(function(){
    var volume = $(this).val();
    vol.gain.value = volume / 100;
  });
}

function loop(looper, id){
  $("#" + id).change(function(){
    if ($(this).is(':checked')){
      looper.loop = true;
    } else {
      looper.loop = false;
    }
  });
}

function pan(panner, id){
  $("#" + id).change(function(){
    var pan = $(this).val();
    panner.setPosition(pan, 0, 0);
  });
}

//FIX VARIABLE NAME CREATION!!!
function makeSource(bufferList){
  //console.log(counter);
  //var source = context.createBufferSource();
  //var gain = context.createGainNode();
  //source.buffer = bufferList[counter];
  eval("var source" + counter + "=context.createBufferSource()");
  eval("var gain" + counter + "=context.createGainNode()");
  eval("var panner" + counter + "=context.createPanner()");
  eval("panner" + counter + ".panningModel = 1");
  eval("source" + counter + ".buffer=bufferList[counter]");
  eval("console.log('source" + counter +"')");
  eval("createMute('mute" + counter + "')");
  eval("createVolume('volume" + counter + "')");
  eval("createLoop('loop" + counter + "')");
  eval("createPan('pan" + counter + "')");
  eval("mute(gain" + counter + ", 'mute" + counter + "')");
  eval("changeVolume(gain" + counter + ", 'volume" + counter + "')");
  eval("pan(panner" + counter + ", 'pan" + counter + "')");
  eval("loop(source" + counter +", 'loop" + counter + "')");
  eval("source" + counter + ".connect(gain" + counter + ")");
  //debugger
  eval("gain" + counter + ".connect(panner"+ counter +")");
  eval("panner" + counter + ".connect(masterGain)");
  eval("tracks.push(source" + counter + ")");
  eval("window.source" + counter +"=source" + counter);
  eval("window.gain" + counter +"=gain" + counter);
  counter++;

}

function makeMasterFader(){
  masterGain = context.createGainNode();
  masterGain.gain.value = 1;
  var compressor = new tuna.Compressor({
                     threshold: -10,    //-100 to 0
                     makeupGain: 1,     //0 and up
                     attack: 1,         //0 to 1000
                     release: 0,        //0 to 3000
                     ratio: 10,          //1 to 20
                     knee: 5,           //0 to 40
                     automakeup: true,  //true/false
                     bypass: 1
                   });
    $('#buss').change(function(){
    if($(this).is(':checked')){
      compressor.bypass = 0;
      } else {
        compressor.bypass = 1;}

    });
  masterGain.connect(compressor.input);
  compressor.connect(context.destination);
}

function bussBypass(){

  }

function createMute(id){
  $('<button />', {'id': id, text: 'MUTE'}).appendTo('#controls');
}

function createVolume(id){
  $('<label />', {text: 'Volume'}).appendTo('#controls');
  $('<input />', {'id': id, 'type': 'range', 'min': '0', 'max': '100', 'value': '100'}).appendTo('#controls');
}

function createLoop(id){
  $('<label />', {text: 'Loop'}).appendTo('#controls');
  $('<input />', {'type': 'checkbox', 'id': id}).appendTo('#controls');
}

function createPan(id){
  $('<label />', {text: 'Pan'}).appendTo('#controls');
   $('<input />', {'id': id, 'type': 'range', 'min': '-4', 'max': '4', 'value': '0'}).appendTo('#controls');
}


function changeMasterVolume(){
  $("#master").change(function(){
  var volume = $( "#master" ).val();
  masterGain.gain.value = volume / 100;
  });
}


