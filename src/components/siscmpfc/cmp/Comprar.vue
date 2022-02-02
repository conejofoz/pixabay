v-<template>
    <v-app>
        <v-form ref="form" v-model="formValido" lazy-validation>
            <v-container>

                <v-row>
                    <v-col>
                        <v-app-bar color="green" dense>
                            <v-btn icon @click="iniciar"><v-icon>add_box</v-icon></v-btn>
                            <v-btn icon @click="buscar"><v-icon>search</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <div v-for="(value, key) in totais" :key="key">
                                <span class="text-capitalize red--text"> {{ key }} </span>
                                <span class="font-weight-bold"> {{ value }} </span>
                            </div>
                        </v-app-bar>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <!-- <v-text-field v-model="editedCompra.id" append-icon="mdi-magnify" label="N. Compra" disabled></v-text-field> -->
                        <v-row>
                            <v-col cols="12" md="8"><v-text-field v-model="editedCompra.id" append-icon="mdi-magnify" label="N. Compra" disabled></v-text-field></v-col>
                            <v-col cols="12" md="4">
                                <v-btn color="red" icon @click="buscar" dense>
                                    <v-icon>search</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>





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
                            <v-date-picker v-model="editedCompra.data" 
                                scrollable 
                                color="success" locale="pt"
                                :disabled="editedCompra.id!=-1"
                            >
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
                            :disabled="editedCompra.id!=-1"
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
                        <v-btn color="error" icon @click="editedDetalhe = detalhe_inicial "><v-icon>cleaning_services</v-icon></v-btn>
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
                        <template v-slot:no-data>
                            <v-alert dense type="info">Nenhum produto</v-alert>
                        </template>
                        <template v-slot:item.acoes="{item}">
                            <v-icon color="danger" small @click="apagarDetalhe(item)">mdi-delete</v-icon>
                        </template>
                        <template slot="body.append">
                            <tr class="red--text text-darken-4 blue lighten-4 font-weight-bold">
                                <td></td>
                                <td></td>
                                <td>{{totais.quantidade}}</td>
                                <td></td>
                                <td>{{totais.subtotal}}</td>
                                <td>{{totais.desconto}}</td>
                                <td>{{totais.total}}</td>
                                <td></td>
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
            //hoje: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
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
            dialogCalendario:false,
            compra_inicial:{
                id:-1,
                fornecedor:{
                    id:-1,
                    nome:''
                },
                data: this.hoje
            },
            detalhe_inicial:{
                id:-1,
                compra:-1,
                produto:-1,
                quantidade:0,
                preco:0,
                subtotal:0,
                desconto:0,
                total:0
            }
        }
    },
    methods: {
        async iniciar(){
            this.loading = true
            let fornecedores = await this.api.getFornecedores()
            this.fornecedores = fornecedores
            this.produtos = await this.ApiInv.getProdutos()

            this.editedCompra = Object.assign({}, this.compra_inicial)
            this.editedDetalhe = Object.assign({}, this.detalhe_inicial)
            this.detalhe = []

            this.editedCompra.data = this.hoje
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
                fornecedor: compra.fornecedor.id === undefined ? compra.fornecedor : compra.fornecedor.id,
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

            await this.api.saveDetalhe(itensCompra)

            this.updateDetalhe()
 

        },
        async updateDetalhe(){
            this.loading = true
            const ultimaCompra = await this.api.get(this.editedCompra.id)
            console.log(ultimaCompra)
            this.editedCompra = ultimaCompra
            const fornecedor = await this.api.getFornecedores(ultimaCompra.fornecedor)
            this.editedCompra.fornecedor = fornecedor
            this.detalhe = ultimaCompra.detalhe
            this.loading = false
        },
        async buscar(){
            const {value:idCompra} = await this.$swal.fire({
                title:"Digite número de compra",
                input: "text",
                allowOutsideClick:false,
                showCancelButton:true,
                inputValidator: (value)=>{
                    if(!value){
                        return "Deve digitar o número da compra"
                    }
                }
            })

            if(idCompra){
                this.editedCompra.id = idCompra
                await this.updateDetalhe()

                if(this.editedCompra.id === undefined){
                    this.editedCompra = {
                        id:-1,
                        fornecedor:{
                            id:-1,
                            nome:""
                        },
                        data: this.hoje
                    }
                    this.$swal("Compra não encontrada", idCompra, "error")    
                }
            } else {
                this.$swal("Busca cancelada", "", "warning")
            }
        },
        async apagarDetalhe(item){
            /* if(confirm("apagar")){
                await this.api.apagarDetalhe(item.id)
                this.updateDetalhe()
            } */
            const result = await this.prompt(`${item.produto_descricao} com id ${item.id}?`, "Apagar?")
            if(result.isConfirmed){
                await this.api.delDetalhe(item.id)
                this.updateDetalhe()
            }
        },
        async prompt(mensagem, titulo){
            try {
                let result = await this.$swal({
                    title: titulo,
                    text: mensagem,
                    icon: 'warning',
                    showCancelButton:true,
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Não',
                    reverseButtons:true
                })
                return result
            } catch (error) {
                console.log(error)
            }
        }
    },
    created(){
        this.iniciar()
    },
    computed:{
        hoje(){
            return new Date().toISOString().substr(0,10)
        },
        totais(){
            let t = {
                quantidade:0,
                subtotal:0,
                desconto:0,
                total:0
            }
            if(this.detalhe != undefined){
                this.detalhe.reduce((i, obj)=>{
                    t.quantidade += obj.quantidade
                    t.subtotal += obj.subtotal
                    t.desconto += obj.desconto
                    t.total += obj.total
                },0)
            }
            return t
        }
    }
}
</script>
