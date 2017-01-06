import Vue from 'vue';
import VueLocalStorage from 'vue-localstorage'
import Header from './components/Header.vue';
import Machine from './components/Machine.vue';
import PortraitWarning from './components/PortraitWarning.vue';

Vue.use(VueLocalStorage);

Vue.filter('slugify', function (text) {
  return text.toLowerCase()
     .replace(/\s+/g, '-')
     .replace(/[^\w\-]+/g, '')
     .replace(/\-\-+/g, '-')
     .replace(/^-+/, '')
     .replace(/-+$/, '');
});

new Vue({
  el: '#app',
  components: {
    'page-header': Header,
    'drum-machine': Machine,
    'portrait-warning': PortraitWarning
  }
});
