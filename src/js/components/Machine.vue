<template>
  <main class="drum-machine">
    <form action>
      <h2 class="vh" id="dm-main-heading">Drum Machine Main Controls</h2>
      <div class="bpm-and-play" aria-labelledby="dm-main-heading">
        <div class="reset">
          <button @click.prevent="reset" aria-label="reset">
            <reset-icon></reset-icon>
          </button>
        </div>
        <div class="bpm">
          <div class="bpm-slider">
            <input type="range" id="bpm" min="0" max="240" v-model="meta.bpm">
          </div>
          <label for="bpm">
            {{meta.bpm}}
            <span aria-hidden="true">bpm</span>
            <span class="vh">beats per minute</span>
          </label>
        </div>
        <div class="play-stop">
          <button :aria-pressed="meta.isPlaying.toString()" @click.prevent="playOrStop" aria-label="play">
            <play-icon></play-icon>
          </button>
        </div>
        <div class="link">
          <button @click.prevent="link" aria-label="link">
            <link-icon></link-icon>
          </button>
        </div>
      </div>
      <div class="tracks" aria-labelledby="dm-tracks-heading">
        <h2 class="vh" id="dm-tracks-heading">Drum Machine Tracks</h2>
        <fieldset role="group" :aria-labelledby="sound.name + '-track-legend' | slugify" v-for="sound in sounds" class="track">
          <legend :id="sound.name + '-track-legend' | slugify">{{sound.name}} track</legend>
          <div class="track-main">
            <div class="track-addRemove">
              <button aria-label="remove beat" @click.prevent="removeBeat(sound)">
                <remove-icon></remove-icon>
              </button>
              <button aria-label="add beat" @click.prevent="addBeat(sound)">
                <add-icon></add-icon>
              </button>
            </div>
            <div class="track-beats" role="group" :aria-labelledby="sound.name + '-track-label' | slugify">
              <span class="track-label" :id="sound.name + '-track-label' | slugify">
                <span class="vh">{{sound.length}} quarter beats for</span>
                {{sound.name}}
              </span>
              <div v-for="n in sound.length" :style="{ width: meta.beatsLength }">
                <input type="checkbox" :id="sound.name + '-beat-' + n | slugify" :value="n" v-model="sound.active">
                <label :for="sound.name + '-beat-' + n | slugify" :id="sound.name + '-beat-' + n + '-label' | slugify"><span class="vh">Quarter Beat {{n}}</span></label>
              </div>
            </div>
            <div class="track-muteSettings">
              <button @click.prevent="sound.muted = !sound.muted" :aria-pressed="sound.muted.toString()" aria-label="mute">
                <mute-icon></mute-icon>
              </button>
              <button class="open-settings" @click.prevent="sound.expanded = !sound.expanded" :aria-expanded="sound.expanded.toString()" aria-label="settings">
                <settings-icon></settings-icon>
              </button>
            </div>
          </div>
          <transition name="slide">
            <fieldset role="group" aria-labelledby="track-settings-label" v-if="sound.expanded" class="track-settings">
              <legend id="track-settings-label">Track settings</legend>
              <div class="setting">
                <label for="vol">Volume</label>
                <div>
                  <input type="range" id="vol" min="0" max="100" v-model="sound.volume" aria-describedby="vol-desc">
                  <span id="vol-desc">From 0 to 100</span>
                </div>
              </div>
              <div class="setting">
                <p aria-hidden="true">Probability</p>
                <div>
                  <label for="prob-chance" class="vh">Chance <span class="vh">(probability numerator)</span></label>
                  <input type="number" id="prob-chance" min="1" v-model="sound.probability.chance">
                  <span aria-hidden="true" class="between">in</span>
                  <label for="prob-in" class="vh">In <span class="vh">(probability denominator)</span></label>
                  <input type="number" id="prob-in" min="1" v-model="sound.probability.in">
                </div>
              </div>
              <div class="setting" v-if="meta.detuneSupport">
                <label for="fluc">Pitch fluctuation</label>
                <div>
                  <input type="range" id="fluc" min="0" max="100" v-model="sound.fluctuationLevel" aria-describedby="fluc-desc">
                  <span id="fluc-desc">From 0 to 100</span>
                </div>
              </div>
              <div class="setting">
                <p aria-hidden="true">Overridden sounds</p>
                <div class="checkbox-group">
                  <div v-for="otherSound in sounds" v-if="otherSound.name !== sound.name">
                    <input type="checkbox" :id="sound.name + '-overrides-' + otherSound.name | slugify" :value="otherSound.name" v-model="sound.overrides">
                    <label :for="sound.name + '-overrides-' + otherSound.name | slugify">
                      <span class="vh">override</span>
                      {{otherSound.name}}
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </transition>
        </fieldset>
        <aside class="stats">
          <h2 class="vh">Drum Machine State Information</h2>
          <p>Polymetric pattern length: {{meta.compoundLength / 4}} beats ({{meta.compoundLength}} &#x00bc;-beats)</p>
        </aside>
      </div>
    </form>
  </main>
</template>

<script>
import PlayIcon from './PlayIcon.vue';
import MuteIcon from './MuteIcon.vue';
import AddIcon from './AddIcon.vue';
import LinkIcon from './LinkIcon.vue';
import RemoveIcon from './RemoveIcon.vue';
import ResetIcon from './ResetIcon.vue';
import SettingsIcon from './SettingsIcon.vue';


var defaultState = {
  sounds: [
    {
      name: 'kick',
      url: 'sounds/kick.mp3',
      buffer: null,
      length: 8,
      current: 1,
      active: [1],
      probability: {
        chance: 1,
        in: 1
      },
      probable: true,
      fluctuationLevel: 0,
      overrides: [],
      volume: 100,
      muted: false,
      expanded: false
    },
    {
      name: 'snare',
      url: 'sounds/snare.mp3',
      buffer: null,
      length: 8,
      current: 1,
      active: [5],
      probability: {
        chance: 1,
        in: 1
      },
      probable: true,
      fluctuationLevel: 40,
      overrides: ['kick', 'snare light'],
      volume: 100,
      muted: false,
      expanded: false
    },
    {
      name: 'snare light',
      url: 'sounds/snare_light.mp3',
      buffer: null,
      length: 8,
      current: 1,
      active: [],
      probability: {
        chance: 1,
        in: 1
      },
      probable: true,
      fluctuationLevel: 60,
      overrides: ['kick'],
      volume: 100,
      muted: false,
      expanded: false
    },
    {
      name: 'hi hat',
      url: 'sounds/hat.mp3',
      buffer: null,
      length: 8,
      current: 1,
      active: [1, 3, 5, 7],
      probability: {
        chance: 1,
        in: 1
      },
      probable: true,
      fluctuationLevel: 60,
      overrides: [],
      volume: 80,
      muted: false,
      expanded: false
    },
    {
      name: 'ride',
      url: 'sounds/ride.mp3',
      buffer: null,
      length: 8,
      current: 1,
      active: [1, 5],
      probability: {
        chance: 1,
        in: 1
      },
      probable: true,
      fluctuationLevel: 40,
      overrides: ['hi hat'],
      volume: 100,
      muted: true,
      expanded: false
    },
    {
      name: 'crash',
      url: 'sounds/crash.mp3',
      buffer: null,
      length: 8,
      current: 1,
      active: [1],
      probability: {
        chance: 1,
        in: 4
      },
      probable: true,
      fluctuationLevel: 40,
      overrides: ['hi hat', 'ride'],
      volume: 90,
      muted: true,
      expanded: false
    }
  ],
  meta: {
    bpm: 120,
    beatsLength: 8,
    futureTickTime: 0.0,
    isPlaying: false,
    detuneSupport: true
  }
};

var soundProps = [
  'length',
  'active',
  'probable',
  'probability',
  'overrides',
  'volume',
  'fluctuationLevel',
  'muted'
];

var parseQuery = function (query) {
  if (query.startsWith('?')) {
      var parts = query.substring(1).split('&');
      var params = parts.reduce(function(agg, part) {
          var bits = part.split('=');
          var name = decodeURIComponent(bits[0]);
          var values = agg[name] || [];
          if (bits.length > 1) {
              values.push(decodeURIComponent(bits[1]));
          }
          agg[name] = values;
          return agg;
      }, {});
      return params;
  }
};

export default {
  data() {
    return {
      audioContext: null,
      sounds: null,
      meta: {
        bpm: 120,
        isPlaying: false
      }
    }
  },
  components: {
    PlayIcon,
    MuteIcon,
    AddIcon,
    LinkIcon,
    RemoveIcon,
    ResetIcon,
    SettingsIcon
  },
  methods: {
    audioContextCheck() {
      if (typeof AudioContext !== 'undefined') {
        return new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        return new webkitAudioContext();
      } else if (typeof mozAudioContext !== 'undefined') {
        return new mozAudioContext();
      } else {
        throw new Error('AudioContext not supported');
      }
    },
    soundLoader(path) {
      var soundObject = {};

      var getSound = new XMLHttpRequest();
      getSound.open('GET', path, true);
      getSound.responseType = 'arraybuffer';

      getSound.onload = () => {
        this.audioContext.decodeAudioData(getSound.response, (buffer) => {
          soundObject.soundToPlay = buffer;
        });
      }

      getSound.send();

      soundObject.play = (volumeVal, time, fluctuationLevel, animElem) => {
        var volume = this.audioContext.createGain();
        volume.gain.value = volumeVal;
        var playSound = this.audioContext.createBufferSource();
        playSound.buffer = soundObject.soundToPlay;

        // Feature detect detune method
        if (this.meta.detuneSupport) {
          // Naturalization by fluctuating pitch slightly
          var bend = Math.floor(Math.random() * fluctuationLevel) + -Math.abs(fluctuationLevel);
          playSound.detune.value = bend;
        }

        // Volume control
        playSound.connect(volume);
        volume.connect(this.audioContext.destination);

        playSound.start(time);

        window.requestAnimFrame(() => {
          this.pulse(animElem);
        });
      }

      return soundObject;
    },
    loadSounds() {
      this.sounds.forEach((sound) => {
        sound.buffer = this.soundLoader(sound.url);
      });
    },
    setState() {

      var storage = this.$localStorage.get('drum-machine-state');

      if (storage) {
        var savedData = JSON.parse(storage);
        this.sounds = savedData.sounds;
        this.meta = savedData.meta;
      } else {
        this.sounds = JSON.parse(JSON.stringify(defaultState.sounds));
        this.meta = JSON.parse(JSON.stringify(defaultState.meta));
      }

      var queryState = parseQuery(window.location.search);
      if (queryState) {
        var params = Object.keys(queryState);
        var state = {
            sounds: [],
            meta: {}
        };
        params.forEach(function(key) {
            if (key === 'bpm') {
                state.meta.bpm = JSON.parse(queryState.bpm[0]);
            } else {
                var sound = JSON.parse(queryState[key][0]);
                sound.name = key;
                state.sounds.push(sound);
            }
        });
        this.updateState(state);
      }

    },
    futureTick() {
      var noteLength = 60 / this.meta.bpm;
      this.meta.futureTickTime += 0.25 * noteLength;

      this.sounds.forEach((sound) => {
        sound.current++;
        if (sound.current > sound.length) {
          sound.current = 1;
        }
      });
    },
    scheduleNote() {
      this.sounds.forEach((sound) => {
        sound.probable = this.probability(sound.probability);
      });
      this.sounds.forEach((sound) => {
        this.playOrNot(sound, sound.active.includes(sound.current));
      });
    },
    playOrNot(sound, currentIsActive) {
      if (!currentIsActive) {
        return;
      }

      if (sound.muted) {
        return;
      }

      if (!sound.probable) {
        return;
      }

      var overridden = false;

      this.sounds.forEach((otherSound) => {
        if (otherSound.overrides.includes(sound.name)) {
          if (!otherSound.muted) {
            if (otherSound.probable) {
              if (otherSound.active.includes(otherSound.current)) {
                overridden = true;
              }
            }
          }
        }
      });

      if (overridden) {
        return;
      }

      var soundID = this.slugify(sound.name + '-beat-' + sound.current) + '-label';
      var animElem = document.getElementById(soundID);

      sound.buffer.play(
        sound.volume / 100,
        this.meta.futureTickTime,
        sound.fluctuationLevel,
        animElem
      );

    },
    scheduler() {
      while (this.meta.futureTickTime < this.audioContext.currentTime + 0.1) {
        this.scheduleNote();
        this.futureTick();
      }
      window.t = window.setTimeout(this.scheduler, 50.0);
    },
    probability(ratio) {
      var set = [];

      if (ratio.chance >= ratio.in) {
        return true;
      }

      var i = 0;
      do {
        i += 1;
        set.push(true);
      }
      while (i < ratio.chance);

      var n = 0;
      do {
        n += 1;
        set.push(false);
      }
      while (n < (ratio.in - ratio.chance));

      var playIt = set[Math.floor(Math.random()*set.length)];
      return playIt;
    },
    playOrStop() {
      this.play();
    },
    reset() {
        this.updateState(defaultState);
        if (history.pushState) {
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.pushState({path:newurl},'',newurl);
        }
    },
    updateState(newState) {
        if (newState.sounds) {
            var soundsByName = newState.sounds.reduce(function(agg, sound) {
                agg[sound.name] = sound;
                return agg;
            }, {});

            this.sounds.forEach(function (sound) {
                var newSound = soundsByName[sound.name];
                soundProps.forEach(function(prop) {
                    sound[prop] = JSON.parse(JSON.stringify(newSound[prop]));
                });
            });
        }

        if (newState.meta) {
            this.meta.bpm = newState.meta.bpm;
        }
    },
    link() {
        var parts = ['bpm=' +this.meta.bpm];
        this.sounds.forEach(function(sound) {
            var persisted = soundProps.reduce(function(agg, prop) {
                agg[prop] = sound[prop];
                return agg;
            }, {});
            var part = encodeURIComponent(sound.name) + '=' + encodeURIComponent(JSON.stringify(persisted));
            parts.push(part);
        });

        if (history.pushState) {
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + parts.join('&');
          window.history.pushState({path:newurl},'',newurl);
        }
    },
    addBeat(sound) {
      sound.length += 1;
    },
    removeBeat(sound) {
      sound.length -= 1;
    },
    play() {
      this.meta.isPlaying = !this.meta.isPlaying;
      if (this.meta.isPlaying) {
        this.sounds.forEach((sound) => {
          sound.current = 1;
        });

        this.meta.futureTickTime = this.audioContext.currentTime;
        this.scheduler();
      } else {
        window.clearTimeout(window.t);
        this.saveData();
      }
    },
    lengthInfo() {
      var lengths = [];
      this.sounds.forEach((sound) => {
        lengths.push(sound.length);
      });
      return {
        longest: Math.max.apply(Math, lengths),
        lengths: lengths
      }
    },
    slugify(text) {
      return text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    },
    pulse(elem) {
      elem.setAttribute('class', 'pulse-anim');
      window.setTimeout(() => {
        elem.setAttribute('class', '');
      }, 100);
    },
    saveData() {
      var data = {};
      data.sounds = this.sounds;
      data.meta = this.meta;
      this.$localStorage.set('drum-machine-state', JSON.stringify(data));
    }
  },
  watch: {
    sounds: {
      handler() {
        var lengthInfo = this.lengthInfo();
        this.meta.beatsLength = 100 / lengthInfo.longest + '%';
        var uniqueLengths = lengthInfo.lengths.filter((v, i, a) => a.indexOf(v) === i);
        this.meta.compoundLength = uniqueLengths.reduce((a, b) => a * b);
      },
      deep: true
    }
  },
  mounted() {
    this.audioContext = this.audioContextCheck();
    this.setState();
    // Test for detune method support
    var testBufferResource = this.audioContext.createBufferSource();
    if (!testBufferResource.detune) {
      this.meta.detuneSupport = false;
    }
    this.loadSounds();
    window.requestAnimFrame = (() => {
      return  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function (callback) {
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  }
}
</script>
