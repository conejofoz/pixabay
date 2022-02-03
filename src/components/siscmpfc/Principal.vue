<template>
    <v-card class="cor-fundo">
        <v-card-title>
            <h1 class="font-weight-bold display-6 cor-texto">Sistema de compras e faturação <small>Infinity Group S.A.</small></h1>
        </v-card-title>
        <v-tabs>
            <v-tab>Estoque</v-tab>
            <v-tab>Compra</v-tab>
            <v-tab>Faturamento</v-tab>
            <v-tab-item>
                <Estoque />
            </v-tab-item>
            <v-tab-item>
                <compras />
            </v-tab-item>
            <v-tab-item>
                <Faturas />
            </v-tab-item>
                
        </v-tabs>

    </v-card>
</template>


<script>
import Estoque from './inv/Estoque'
import Compras from './cmp/Compras.vue'
import Faturas from './fac/Faturas.vue'

export default {
    name:"Principal",
    components:{
        Estoque,
        Compras,
        Faturas,
    },
    props:[],
    data() {
        return {
            
        }
    },
    methods: {
        
    },
    computed:{

    }
}
</script>


<style>
.cor-fundo{
    background-color: #FFFBE6 !important;
}
.cor-texto{
    color: #356859 !important;
}
</style>

