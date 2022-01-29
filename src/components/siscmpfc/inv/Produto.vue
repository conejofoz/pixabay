<template>
    <v-app>
        <v-row>
            <v-col>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"></v-text-field>

                <v-data-table
                    dense
                    :headers="headers"
                    :items="itens"
                    :search="search"
                    class="elevation-1"
                    :loading="loading"
                    loading-text="Carregando..."
                >

                    <template v-slot:top>
                        <v-toolbar flat color="white">
                            <v-toolbar-title>Produtos</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-btn class="mb-2" color="warning" dark @click="iniciar"><v-icon>cached</v-icon></v-btn>
                            
                            <v-dialog v-model="dialog" max-width="100%">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                        <v-icon>add_box</v-icon>
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="2">
                                                    <v-text-field v-model="editedItem.id" label="ID" disabled></v-text-field>
                                                </v-col>
                                                <v-col cols="5">
                                                    <v-text-field v-model="editedItem.codigo" label="Código"></v-text-field>
                                                </v-col>
                                                <v-col cols="5">
                                                    <v-text-field v-model="editedItem.descricao" label="Descrição"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-autocomplete
                                                        v-model="editedItem.subcategoria"
                                                        :items="subcategorias"
                                                        label="Sub Categorias"
                                                        item-text="descricao"
                                                        item-value="id"
                                                        return-object
                                                    >

                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.stock" label="Estoque" disabled></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.preco" label="Preço"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                        <v-btn color="pink accent-3" text @click="save">Salvar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                        </v-toolbar>                        
                    </template>
                    
                    <template v-slot:item.acoes="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                        <v-icon small color="danger" @click="deleteItem(item)">mdi-delete</v-icon>
                    </template>

                    <template v-slot:no-data>
                        <v-btn color="primary" @click="iniciar">Reiniciar</v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-app>
</template>


<script>
import {ApiInv} from './ApiInv'

export default {
    name:"Produto",
    components:{

    },
    props:[],
    data() {
        return {
            itens:[],
            api: new ApiInv,
            loading:false,
            search: "",
            headers:[
                {text: "ID", value: "id"},
                {text: "Código", align: 'start', sortable: true, value: 'codigo'},
                {text: "Descrição", align: 'start', sortable: true, value: 'descricao'},
                {text: "Estoque", sortable: false, value: 'stock'},
                {text: "Preço", sortable: false, value: 'preco'},
                {text: "Sub Categoria", sortable: false, value: 'subcat_descricao'},
                {text: "Ações", value:'acoes', sortable:false}
            ],
            dialog:false,
            editedIndex:-1,
            editedItem:{ id:-1, codigo:"", descricao:"", stock:0, preco:0, subcategoria:{"id":-1, descricao:""}},
            defaultItem:{ id:-1, codigo:"", descricao:"", stock:0, preco:0, subcategoria:{"id":-1, descricao:""}},
            subcategorias:[]
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
       async iniciar(){
           try {
                this.loading = true
                let produtos = await this.api.getProdutos()
                this.itens = produtos

                this.subcategorias = await this.api.getSubCategorias()
           } catch (error) {
                alert(error)               
           } finally{
               this.loading = false
           }
       },
       close(){
           this.dialog = false
           this.$nextTick(()=>{
               this.editedItem = Object.assign({}, this.defaultItem)
               this.editedIndex = -1
           })
       },
       editItem(item){
           this.editedIndex = this.itens.indexOf(item)
           this.editedItem = Object.assign({}, item)
           this.dialog = true
       },
       async deleteItem(item){
           await this.api.delProduto(item.id)
           this.iniciar()
       },
       async save(){
           //const obj = this.editedItem

           const cp = this.editedItem
           const cat = cp["subcategoria"]
           let idCat = null

           if(cat["id"]!==undefined){
               idCat = cat["id"]
           } else {
               idCat = cat
           }

           const obj = {
               id:cp["id"],
               codigo: cp["codigo"],
               descricao: cp["descricao"],
               stock: cp["stock"],
               preco: cp["preco"],
               subcategoria: idCat,
               subcategoria_id: idCat
           }

           try {
               this.loading = true
               await this.api.saveProduto(obj)
               this.close()
               this.iniciar()
           } catch (error) {
               alert(error)
           } finally{
               this.loading = false
           }
       },
    },
    computed:{
        formTitle(){
            return (this.editedIndex === -1 ? "Nova" : "Editar") + 'Sub Categoria'
        }
    },
    watch:{
        dialog(val){
            val || this.close()
        }
    }
}
</script>


<style lang="stylus">

</style>

