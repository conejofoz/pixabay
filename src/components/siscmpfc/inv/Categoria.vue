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
                            <v-toolbar-title>Categorias</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-btn class="mb-2" color="warning" dark @click="iniciar"><v-icon>cached</v-icon></v-btn>
                            
                            <v-dialog v-model="dialog" max-width="500px">
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
                                                <v-col cols="2" sm="2" md="2">
                                                    <v-text-field v-model="editedItem.id" label="ID" disabled></v-text-field>
                                                </v-col>
                                                <v-col cols="10" sm="10" md="10">
                                                    <v-text-field v-model="editedItem.descricao" label="Descrição"></v-text-field>
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
import mensagensMixin from '../../../mixins/mensagensMixin.js'

export default {
    name:"Categoria",
    components:{

    },
    props:[],
    mixins:[mensagensMixin],
    data() {
        return {
            itens:[],
            api: new ApiInv,
            loading:false,
            search: "",
            headers:[
                {text: "ID", value: "id"},
                {text: "Descrição", align: 'start', sortable: false, value: 'descricao'},
                {text: "Ações", value:'acoes', sortable:false}
            ],
            dialog:false,
            editedIndex:-1,
            editedItem:{ id:-1, descricao:""},
            defaultItem:{ id:-1, descricao:""},
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
       async iniciar(){
           try {
                this.loading = true
                let categorias = await this.api.getCategorias()
                this.itens = categorias
           } catch (error) {
                //this.mensagem(error, "Houve um erro!", "error") //mixin local
                this.mensagemErro(error) //mixin global no main.js
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
           if(await this.mensagemPergunta(`categoria ${item.descricao}?`, "Apagar")){
               await this.api.delCategoria(item.id)
               this.iniciar()
               this.mensagem("eliminada com sucesso!", "Categoria")
            
           }
       },
       async save(){
           //const obj = this.editedItem

          const obj = new FormData()
          for (const key in this.editedItem) {
              obj.append(key, this.editedItem[key])
          }
           
           
           try {
               this.loading = true
               await this.api.saveCategoria(obj)
               this.close()
               this.iniciar()
               this.mensagem("Salvo com sucesso", "salvo", "success") //mixin
           } catch (error) {
               alert(error)
           } finally{
               this.loading = false
           }
       },
    },
    computed:{
        formTitle(){
            return (this.editedIndex === -1 ? "Nova" : "Editar") + 'Categoria'
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

