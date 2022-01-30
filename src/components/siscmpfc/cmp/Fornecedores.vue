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
                            <v-toolbar-title>Fornecedores</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-btn class="mb-2" color="warning" dark @click="iniciar"><v-icon>cached</v-icon></v-btn>
                            
                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                        <v-icon>add_box</v-icon>
                                    </v-btn>
                                </template>
                                <v-form ref="form" v-model="formValido" lazy-validation>
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
                                                    <v-text-field v-model="editedItem.nome" :rules="textRules" label="Nome"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.telefone" label="Telefone"></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.email" :rules="emailRules" label="E-mail"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                        <v-btn color="pink accent-3" text @click="save" :disabled="!formValido">Salvar</v-btn>
                                    </v-card-actions>
                                </v-card>
                                </v-form>
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
import {ApiCmp} from './ApiCmp'

export default {
    name:"Fornecedores",
    components:{

    },
    props:[],
    data() {
        return {
            itens:[],
            api: new ApiCmp,
            loading:false,
            search: "",
            headers:[
                {text: "ID", value: "id"},
                {text: "Nome", align: 'start', sortable: false, value: 'nome'},
                {text: "Telefone", align: 'start', sortable: false, value: 'telefone'},
                {text: "E-mail", align: 'start', sortable: false, value: 'email'},
                {text: "Ações", value:'acoes', sortable:false}
            ],
            dialog:false,
            editedIndex:-1,
            editedItem:{ id:-1, nome:"", telefone:"", email:""},
            defaultItem:{ id:-1, nome:"", telefone:"", email:""},
            emailRules:[
                v => !!v || "E-mail is requerido",
                v => /.+@.+/.test(v) || "E-mail deve ser válido"
            ],
            textRules:[
                v => !!v || "Requerido",
            ],
            formValido:true,
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
       async iniciar(){
           try {
                this.loading = true
                let fornecedores = await this.api.getFornecedores()
                this.itens = fornecedores
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
           this.$swal.fire({
            title: 'Tem certeza?',
            html: `Apagar o fornecedor <br><b>${item.nome}</b>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim!',
            cancelButtonText: 'Não!',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
            }).then( async (result) => {
                if (result.isConfirmed) {
                    await this.api.delFornecedor(item.id)
                    this.iniciar()
                    this.$swal.fire('Apagado!','O fornecedor foi apagado com sucesso.','success')
                } else {
                    this.$swal.fire('Cancelado!','O fornecedor foi mantido.','info')
                }
            })
       },
       async save(){
           const obj = this.editedItem

           if(obj.nome.length <=3){
               this.$swal({title: 'Erro!', text:"Campo nome deve ter mais de três caracteres", icon: 'error'})
               return false
           }

           try {
               this.loading = true
               await this.api.saveFornecedor(obj)
               this.close()
               this.iniciar()
               this.$swal({text:'Salvo com sucesso!', icon: 'success'})
           } catch (error) {
               this.$swal({title: 'Erro!', text:error.toString(), icon: 'error'})
           } finally{
               this.loading = false
           }
       },
    },
    computed:{
        formTitle(){
            return (this.editedIndex === -1 ? "Novo " : "Editar ") + 'Fornecedor'
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

