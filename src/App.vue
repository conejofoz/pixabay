<template>
  <v-app>
      <v-system-bar >
        <v-app-bar-nav-icon @click.stop="mostrarMenu=!mostrarMenu">

        </v-app-bar-nav-icon>
      </v-system-bar>
      <v-navigation-drawer
              expand-on-hover
              temporary
              absolute
              :mini-variant="miniVariant"
              v-model="mostrarMenu"
            >
              <v-list>
                <v-list-item class="px-2">
                  <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                  </v-list-item-avatar>
                </v-list-item>

                <v-list-item link>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      Curso Vue + Django
                    </v-list-item-title>
                    <v-list-item-subtitle>Silvio Coelho</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list nav dense>

               <div  v-for="m in menu" :key="m.nombre">
                  <router-link :to="m.ruta">
                    <v-list-item link>
                      <v-list-item-icon><v-icon>{{m.icono}}</v-icon></v-list-item-icon>
                      <v-list-item-title>{{m.nombre}}</v-list-item-title>
                    </v-list-item>
                  </router-link>
               </div>


                
              </v-list>
      </v-navigation-drawer>
      <router-view></router-view>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
//import Pixabay from './components/pixabay/Pixabay.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld,
   // Pixabay
  },
  data() {
    return {
      menu:[
        {ruta:"/", nombre:"Inicio", icono:"home"},
        {ruta:"/pixa", nombre:"Imagenes", icono:"image_search"},
        {ruta:"/doc", nombre:"Documentos", icono:"devices_other"},
      ],
      mostrarMenu:false,
      miniVariant:true
    }
  },
}
</script>

<style>

a:link{
  text-decoration: none;
}

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
