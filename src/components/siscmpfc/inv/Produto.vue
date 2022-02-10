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
                                                    <span v-money="'R$'">{{editedItem.preco}}</span>
                                                    <v-text-field v-model="editedItem.preco" label="Preço"></v-text-field>
                                                </v-col>
                                            </v-row>

                                            <v-row>
                                                <v-col>
                                                    <template>
                                                        <v-file-input
                                                            @change="changeImage"
                                                            v-model="fileSelected"
                                                            label="Foto do produto"
                                                            filled
                                                            prepend-icon="mdi-camera"
                                                        ></v-file-input>
                                                    </template>
                                                </v-col>
                                            </v-row>

                                            <v-row>
                                                <v-col>
                                                    <v-img
                                                        max-width="300"
                                                        :src="showUrlImagem(editedItem.imagem)"
                                                        id="foto"
                                                        ></v-img>
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

                    <template v-slot:item.imagem="{ item }">
                        <!-- <img :src="row.item.imagem" style="height:50px" alt="" srcset=""> -->
                        <img :src="showImageList(item.imagem)" style="max-width:50px" alt="" srcset="">
                        <!-- <img :src="`${img_url}${row.item.imagem}`" style="height:50px" alt="" srcset=""> -->
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
    props:[],/*
    directives:{
        money: function(el, binding){
        
            //const amount = parseFloat(el.innerHTML).toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.')
            const amount = parseFloat(el.innerHTML).toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+,)/g, '$1.')
            el.innerHTML = `${binding.value} ${amount}`
        
        //usar v-money="'R$'"
        }
    },*/
    data() {
        return {
            fileSelected:null,
            itens:[],
            api: new ApiInv,
            img_url:null,
            loading:false,
            search: "",
            headers:[
                {text: "ID", value: "id"},
                {text: "Código", align: 'start', sortable: true, value: 'codigo'},
                {text: "Descrição", align: 'start', sortable: true, value: 'descricao'},
                {text: "Estoque", sortable: false, value: 'stock'},
                {text: "Preço", sortable: false, value: 'preco'},
                {text: "Sub Categoria", sortable: false, value: 'subcat_descricao'},
                {text: "Ações", value:'acoes', sortable:false},
                {text: "Imagem", value:'imagem', sortable:false},
                
            ],
            dialog:false,
            editedIndex:-1,
            editedItem:{ id:-1, codigo:"", descricao:"", stock:0, preco:0, subcategoria:{"id":-1, descricao:""}, imagem:null},
            defaultItem:{ id:-1, codigo:"", descricao:"", stock:0, preco:0, subcategoria:{"id":-1, descricao:""}, imagem:null},
            subcategorias:[]
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
        changeImage(){
            this.editedItem.imagem = URL.createObjectURL(this.fileSelected)
        },
        showImageList(obj){
            let result = ''
            if(obj){
                result = obj
            } else {
                result = this.img_url + 'media/img/empty.png'
            }
            return result
        },
        showUrlImagem(obj){
            if(obj){
                return obj
            } 
            return this.img_url + 'media/img/empty.png'
        },
       async iniciar(){
           this.img_url = this.api.IMG_URL
           try {
                this.loading = true
                let produtos = await this.api.getProdutos()
                this.itens = produtos

                this.subcategorias = await this.api.getSubCategorias()
           } catch (error) {
                this.$swal("Error", error.toString())
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
           /* await this.api.delProduto(item.id)
           this.iniciar() */

           this.$swal.fire({
            title: 'Tem certeza?',
            html: `Apagar o produto <br><b>${item.descricao}</b>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim!',
            cancelButtonText: 'Não!',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
            }).then( async (result) => {
                if (result.isConfirmed) {
                    await this.api.delProduto(item.id)
                    this.iniciar()
                    this.$swal.fire('Apagado!','O produto foi apagado com sucesso.','success')
                } else {
                    this.$swal.fire('Cancelado!','O produto foi mantido.','info')
                }
            })
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

           const objProduto = {
               id:cp["id"],
               codigo: cp["codigo"],
               descricao: cp["descricao"],
               stock: cp["stock"],
               preco: cp["preco"],
               subcategoria: idCat,
               subcategoria_id: idCat,
               imagem:this.fileSelected
           }

           //
           const obj = new FormData()
            for (const key in objProduto) {
                    if(key == 'imagem'){
                        if(objProduto[key]!==null)
                           obj.append('imagem', objProduto[key])
                    } else {
                        obj.append(key, objProduto[key])
                    }
                }

           //

           try {
               this.loading = true
               const res = await this.api.saveProduto(obj)
               if(typeof(res)=='string'){
                    this.$swal({title: 'Erro!', text:res, icon: 'error'})    
                    return false
               }
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
            return (this.editedIndex === -1 ? "Novo " : "Editar ") + 'Produto'
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

