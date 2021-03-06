// I prefer naming the topmost namespace `App` for simplicity.
window.App = {
  Collections: {},
  Models: {},
  Routers: {},
  Views: {},
  Global: {},

  initialize: function () {
      App.decibels = new App.Collections.Decibels();

      new App.Views.Decibels({
      	collection: App.decibels
      });

      // new App.Models.SoundMeter();

      Backbone.history.start();
  }  
};
$(document).ready(function() {
	App.initialize();

    /*
     *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    'use strict';

    // Meter class that generates a number correlated to audio volume.
    // The meter class itself displays nothing, but it makes the
    // instantaneous and time-decaying volumes available for inspection.
    // It also reports on the fraction of samples that were at or near
    // the top of the measurement range.
    function SoundMeter(context) {
      this.context = context;
      this.instant = 0.0;
      this.slow = 0.0;
      // this.clip = 0.0;
      this.script = context.createScriptProcessor(2048, 1, 1);
      var that = this;
      this.script.onaudioprocess = function(event) {
        var input = event.inputBuffer.getChannelData(0);
        var i;
        var sum = 0.0;
        var clipcount = 0;
        for (i = 0; i < input.length; ++i) {
          sum += input[i] * input[i];
          // if (Math.abs(input[i]) > 0.99) {
          //   clipcount += 1;
          // }
        }
        that.instant = Math.sqrt(sum / input.length);
        that.slow = 0.95 * that.slow + 0.05 * that.instant;
        // that.clip = clipcount / input.length;
        // console.log('instant ' + that.instant);
        // console.log('slow ' + that.slow);
        // console.log('clip ' + that.clip);
      };
    }

    SoundMeter.prototype.connectToSource = function(stream) {
      console.log('SoundMeter connecting');
      this.mic = this.context.createMediaStreamSource(stream);
      this.mic.connect(this.script);
      // necessary to make sample run, but should not be.
      this.script.connect(this.context.destination);
    };

    SoundMeter.prototype.stop = function() {
      this.mic.disconnect();
      this.script.disconnect();
    };



     // *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
     // *
     // *  Use of this source code is governed by a BSD-style license
     // *  that can be found in the LICENSE file in the root of the source
     // *  tree.
     

    /* global AudioContext, SoundMeter */

    'use strict';

    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.audioContext = new AudioContext();
    } catch (e) {
      alert('Web Audio API not supported.');
    }

    // Put variables in global scope to make them available to the browser console.
    var constraints = window.constraints = {
      audio: true,
      video: false
    };

    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    function compare(a,b) {
      if(a.num > b.num) {
        return 1;
      }
      if(a.num < b.num) {
        return -1;
      }
      return 0;
    }  

    function successCallback(stream) {
      // Put variables in global scope to make them available to the browser console.
      window.stream = stream;
      var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
      soundMeter.connectToSource(stream);

      App.decibels.soundMeter = soundMeter;

      App.decibels.interval = setInterval(function() {
        App.decibels.time += 1;
      	var num = parseFloat(soundMeter.slow.toFixed(2)) * 100;
        var threshold = parseFloat(App.decibels.threshold);
      	App.decibels.add([{ 
      		value: num
      	}]);

        // this is the threshold

        if(num > App.decibels.threshold) {

          sendMsg = false;
          if(App.decibels.highPoints.length < 3) {
              App.decibels.highPoints.push({num: num, seconds: App.decibels.time });
              sendMsg = true;
          } else {
              var minHighPoint = App.decibels.highPoints.shift(); 
              if(num > minHighPoint.num) {
                  App.decibels.highPoints.push({num: num, seconds: App.decibels.time });
                  sendMsg = true;
              } else {
                // App.decibels.highPoints.push({num: num, seconds: App.decibels.time });
                  App.decibels.highPoints.push(minHighPoint);
              }
          }

          if(sendMsg) {
            App.decibels.payload['text'] = "It's noisy! The noise level is " + num + ' dB.';
            App.decibels.doCORSRequest({
                method: 'POST',
                url: App.decibels.api,
                content: 'application/json',
                data: JSON.stringify(App.decibels.payload)
              }, function printResult(result) {
            });
          }
          App.decibels.highPoints.sort(compare);
          
        }
      }, 1000);

    }

    function errorCallback(error) {
      console.log('navigator.getUserMedia error: ', error);
    }
    navigator.getUserMedia(constraints, successCallback, errorCallback);
});