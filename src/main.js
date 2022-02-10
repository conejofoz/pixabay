import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';
import App from './App.vue'

import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

import router from './router'
import vuetify from './plugins/vuetify'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import store from './store'

import Vuetify from 'vuetify'
Vue.use(Vuetify)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin

Vue.use(VueSweetalert2)

Vue.use(IconsPlugin)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false


/* mixin global, não é recomendado usar */
Vue.mixin({
  methods: {
    mensagem(mensagem, titulo="", tipo="success"){
      this.$swal({
          title: titulo,
          text: mensagem,
          icon: tipo,
          allowOutsideClick:false,
          confirmButtonText: 'Ok',
      })
    },
    mensagemErro(texto){
      this.mensagem(texto, "Mixin Global", "error")
    }
  },
})

Vue.directive('money',{
  inserted(el, binding){
    //const amount = parseFloat(el.innerHTML).toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.')
    const amount = parseFloat(el.innerHTML).toFixed(2)
    .replace('.',',')
    .replace(/(\d)(?=(\d{3})+,)/g, '$1.')
    el.innerHTML = `${binding.value} ${amount}`
  }
  //usar v-money="'R$'" em atributos que tenham propriedade html
})


new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
