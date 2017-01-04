import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Header from './components/Header.vue';
import Machine from './components/Machine.vue';

Vue.use(VueAxios, axios);

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
    'page-header': Heading,
    'drum-machine': BabyNames
  }
});
