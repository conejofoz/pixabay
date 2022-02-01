v-<template>
    <v-app>
        <v-form ref="form" v-model="formValido" lazy-validation>
            <v-container>

                <v-row>
                    <v-col>
                        <v-text-field v-model="editedCompra.id" append-icon="mdi-magnify" label="N. Compra" disabled></v-text-field>
                    </v-col>
                    <v-col>
                        <v-dialog
                            ref="dialog"
                            v-model="dialogCalendario"
                            :return-value.sync="editedCompra.data"
                            persistent
                            width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="editedCompra.data"
                                    label="Data Compra"
                                    prepend-icon="event"
                                    readonly 
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="editedCompra.data" scrollable color="success" locale="pt">
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="dialogData = false">Cancel</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(editedCompra.data)">Ok</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-col>
                    <v-col>
                        <v-autocomplete
                            v-model="editedCompra.fornecedor"
                            :items="fornecedores"
                            label="Fornecedor"
                            item-text="nome"
                            item-value="id"
                            return-object
                            prepend-icon="mdi-city"
                            :rules="textRules"
                        >
                        </v-autocomplete>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-autocomplete
                            v-model="editedDetalhe.produto"
                            :items="produtos"
                            label="Produto"
                            item-text="descricao"
                            item-value="id"
                            return-object
                            prepend-icon="mdi-city"
                            :rules="textRules"
                        >
                        </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="editedDetalhe.quantidade" append-icon="mdi-magnify" label="Quantidade"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="editedDetalhe.preco" append-icon="mdi-magnify" label="Preço"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-btn color="warning" fab icon :disabled="!formValido" @click="save"><v-icon>save</v-icon></v-btn>
                        <v-btn color="error" icon><v-icon>clear</v-icon></v-btn>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-data-table
                        :headers="headers"
                        item-key="nome"
                        class="elevation-1"
                        dense
                        :loading="loading"
                        loading-text="Carregando..."
                        :items="detalhe"
                    >
                        <template slot="headers" slot-scope="props">
                            <tr>
                                <th
                                    v-for="header in props.headers"
                                    :key="header.text"
                                    :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                    @click="changeSort(header.value)"
                                >
                                    <v-icon small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                            </tr>
                        </template>
                    </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-app>
</template>


<script>
import { ApiCmp } from './ApiCmp'
import { ApiInv } from '../inv/ApiInv'

export default {
    name:'Comprar',
    data() {
        return {
            hoje: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
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
                data: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
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
            ApiInv: new ApiInv(),
            dialogCalendario:false
        }
    },
    methods: {
        async iniciar(){
            this.loading = true
            let fornecedores = await this.api.getFornecedores()
            this.fornecedores = fornecedores
            this.produtos = await this.ApiInv.getProdutos()
            this.loading = false
        },
        async save(){
            if(!this.$refs.form.validate()){
                return false;
            }

            const compra = this.editedCompra
            const detalhe = this.editedDetalhe

            if(compra.fornecedor.id == -1){
                alert("Fornecedor requerido")
                return false
            }
            if(detalhe.produto == -1){
                alert("produto requerido")
                return false
            }
            if(detalhe.quantidade<=0){
                alert('Quantidade inválida')
                return false
            }
            if(detalhe.preco<=0){
                alert('Preço inválida')
                return false
            }

            let cabecalho = {
                id: compra.id,
                fornecedor: compra.fornecedor.id,
                data: compra.data
            }

            let itensCompra = {
                id:-1,
                compra:-1,
                produto:detalhe.produto.id,
                quantidade:detalhe.quantidade,
                preco:detalhe.preco,
                desconto:detalhe.desconto
            } 

            const novaCompra = await this.api.saveCompra(cabecalho)

            if(novaCompra.id===undefined){
                alert(novaCompra)
                return false
            }

            itensCompra.compra = novaCompra.id
            this.editedCompra = novaCompra
            this.editedDetalhe = []

            const d = await this.api.saveDetalhe(itensCompra)
            const fornecedor = await this.api.getFornecedores(novaCompra.fornecedor)
            this.editedCompra.fornecedor = fornecedor

            console.log(d)
            this.updateDetalhe()
 

        },
        async updateDetalhe(){
            this.loading = true
            const ultimaCompra = await this.api.get(this.editedCompra.id)
            console.log(ultimaCompra)
            this.detalhe = ultimaCompra.detalhe
            this.loading = false
        },
    },
    created(){
        this.iniciar()
    }
}
</script>
