<template>
    <b-container fluid>
        <b-row>
            <b-col sm="1">
                <label for="id">N.:</label>
            </b-col>
            <b-col sm="2">
                <b-form-input v-model="cabecalho.id" :disabled="!editar" type="text"></b-form-input>
            </b-col>
            <b-col sm="1">
                <label for="data">Data:</label>
            </b-col>
            <b-col sm="2">
                <b-form-input v-model="cabecalho.data" type="text" disabled></b-form-input>
            </b-col>
            <b-col sm="1">
                <label for="cliente">Cliente:</label>
            </b-col>
            <b-col>
                <b-form-select v-model="cabecalho.cliente" :options="clientes" value-field="id" text-field="nome"></b-form-select>
            </b-col>






        </b-row>
        <b-row></b-row>
        <b-row></b-row>
    </b-container>
</template>


<script>
import { ApiFac} from './ApiFac'
import { ApiInv} from '../inv/ApiInv'
import mensagemMixin from '../../../mixins/mensagensMixin.js'
export default {
    name:"Faturar",
    components:{

    },
    mixins:[mensagemMixin],
    props:[],
    data() {
        return {
            api: new ApiFac(),
            apiInv: new ApiInv(),
            editar: false,
            loading:false,
            search:"",
            clientes:[],
            cabecalho:{
                id:-1,
                cliente:{
                    id:-1,
                    nome:"",
                },
                data: new Date().toLocaleString(),
            },
            detalhe:{
                id:-1,
                venda:-1,
                produto:-1,
                quantidade:0,
                preco:0,
                subtotal:0,
                desconto:0,
                total:0
            },
            itens:[],
            fields:[
                {key: "id", label:"ID", sortable:true},
                {key: "produto_descricao", label:"Produto", sortable:true},
                {key: "quantidade", label:"Quantidade", sortable:true},
                {key: "preco", label:"Preço", sortable:true},
                {key: "subtotal", label:"subtotal", sortable:true},
                {key: "desconto", label:"desconto", sortable:true},
                {key: "total", label:"total", sortable:true},
                {key: "acoes", label:"Ações", sortable:true},
            ]
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
        async iniciar(){
            const clientes = await this.api.getCliente()
            this.clientes = clientes
        },
    },
    computed:{

    }
}
</script>


<style lang="stylus">

</style>

