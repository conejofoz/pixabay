v-<template>
    <v-app>
        <v-container>
            <v-row>

            </v-row>
            <v-row>

            </v-row>
            <v-row>

            </v-row>
        </v-container>
    </v-app>
</template>


<script>
import { ApiCmp } from './ApiCmp'
import { ApiInv } from '../inv/ApiInv'

export default {
    name:'Comprar',
    data() {
        return {
            loading:false,
            formValido:true,
            search:"",
            headers:[
                {text: "ID", value: "id" },
                {text: "Produto", align:"start", sortable:true, value: "produto_descricao" },
                {text: "Quantidade", align:"start", sortable:true, value: "quantidade" },
                {text: "Preço", sortable:true, value: "preco" },
                {text: "Sub Total", sortable:true, value: "subtotal" },
                {text: "Desconto", sortable:true, value: "desconto" },
                {text: "Total", sortable:true, value: "total" },
                {text: "Ações", sortable:true, value: "acoes" }
            ],
            textRules:[v=> !!v || "Requerido"],
            detalhe:[],
            produtos:[],
            fornecedores:[],
            editedCompra:{
                id:-1,
                fornecedor:{
                    id:-1,
                    nome:''
                },
                data: new Date().getFullYear() + new Date().getMonth() + new Date().getDate()
            },
            editedDetalhe:{
                id:-1,
                compra:-1,
                produto:-1,
                quantidade:0,
                preco:0,
                subtotal:0,
                desconto:0,
                total:0
            },
            api: new ApiCmp(),
            ApiInv: new ApiInv()
        }
    },
    methods: {
        async iniciar(){
            this.loading = true
            let fornecedores = await this.api.getFornecedores()
            this.fornecedores = fornecedores
            this.produtos = await this.ApiInv.getProdutos()
            this.loading = false
        }
    },
    created(){
        this.iniciar()
    }
}
</script>
