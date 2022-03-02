import Vue from 'vue';
import VueRouter from 'vue-router'

import Home from './components/Home'
import Pixabay from './components/pixabay/Pixabay'
import Documentos from './components/documentos/Documentos'

Vue.use(VueRouter)




const routes = [
    {
        path:'/',
        name:'home',
        component:Home
    },
    {
        path:'/pixa',
        name:'pixa',
        component:Pixabay
    },
    {
        path:'/documentos',
        name:'documentos',
        component:Documentos
    },
    {
        path:'/siscmpfc',
        name:'siscmpfc',
        component:()=> import('./components/siscmpfc/Principal')
    },
    {
        path:'/login',
        name:'login',
        component:()=>import('./components/login/Login')
    }
]


const router = new VueRouter({
    mode:'history',
    routes
})


/* PROTEGER AS ROTAS - EXIGIR USUÁRIO LOGUEADO NO SISTEMA */
router.beforeEach((to,from,next)=>{
    //const isLogged = localStorage.getItem("access") !== 'undefined' ? true : false
    let isLogged = null
    if((localStorage.getItem("access") !== 'undefined') && (localStorage.getItem("access") !== null))
    {
        isLogged = true
    }
    console.log('Está logado: ', isLogged)
    console.log('access: ', localStorage.getItem("access"))
    console.log(to.name)

    
    /* if(to.name!=='login' && !isLogged){
        next({name:'login'})
    } else {
        next()
    } */
    if(to.name=='login' || to.name=='home'){
        console.log('passou no if')
        next()
    } else {
        if(!isLogged){
            next({name:'login'})
        } else {
            next()
        }
    } 

})

export default router