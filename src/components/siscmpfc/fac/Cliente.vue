<template>
    <b-container>
        <b-row>
            <b-col sm="8">
                <b-form-group
                    label="Filtro"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0"
                >
                    <b-input-group size="sm">
                        <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Buscar..."></b-form-input>
                        <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''">
                                <b-icon icon="x" aria-hidden="true"></b-icon>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <b-col sm="4">
                <b-button pill v-b-modal.modal variant="primary" @click="abrirModal">
                    <b-icon icon="folder-plus" aria-hidden="true"></b-icon>
                </b-button>
                <b-button pill variant="success" @click="iniciar">
                    <b-icon icon="arrow-clockwise" aria-hidden="true"></b-icon>
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-table
                    dense
                    striped
                    hover
                    :items="itens"
                    :fields="fields"
                    primary-key="id"
                    small
                    sticky-header
                    head-variant="light"
                    fixed
                    responsive="sm"
                    :busy="loading"
                    :filter="filter"
                    show-empty
                >
                    <template v-slot:cell(acoes)="row">
                        <!-- <b-button size="sm" class="mr-1" @click="info(row.item, row.index, $event.target)">
                            <b-icon>pencil</b-icon>
                        </b-button>
                        <b-button size="sm" @click="row.toggleDetails">
                            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                        </b-button> -->

                        <b-icon icon="pencil" size="sm" class="mr-2" @click="editar(row.item)"></b-icon> 
                        <b-icon icon="trash" size="sm" @click="apagar(row.item)"></b-icon>
                    </template>
                </b-table>
                <!-- MODAL CLIENTE -->
                <b-modal id="modal" v-model="modalShow" size="xl" title="Clientes" no-close-on-backdrop no-close-on-esc hide-footer centered hide-header-close>
                    <b-container fluid>
                        <b-row class="my-1">
                            <b-col sm="1">
                                <label for="id">Id:</label>
                            </b-col>
                            <b-col sm="2">
                                <b-form-input v-model="cliente.id" disabled type="text"></b-form-input>
                            </b-col>
                            <b-col sm="1">
                                <label for="nome">Nome:</label>
                            </b-col>
                            <b-col>
                                <b-form-input v-model="cliente.nome" type="text" autofocus></b-form-input>
                            </b-col>
                        </b-row>

                        
                        <b-row>
                            <b-col sm="1">
                                <label for="telefone">Telefone:</label>
                            </b-col>
                            <b-col>
                                <b-form-input v-model="cliente.telefone" type="text"></b-form-input>
                            </b-col>
                            <b-col sm="1">
                                <label for="email">E-mail:</label>
                            </b-col>
                            <b-col>
                                <b-form-input v-model="cliente.email" type="text"></b-form-input>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col sm="1">
                                <b-form-checkbox v-model="cliente.estado" name="check-button" switch>Estado</b-form-checkbox>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                <b-button class="mt-3" variant="outline-info" block @click="fecharModal">Cancelar</b-button>
                            </b-col>
                            <b-col>
                                <b-button class="mt-3" variant="outline-danger" block @click="guardar">Guardar</b-button>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>


<script>
import { ApiFac} from './ApiFac'
import { BIcon} from 'bootstrap-vue'

import mensagensMixin from '../../../mixins/mensagensMixin.js'

export default {
    name:"Cliente",
    components:{
        BIcon
    },
    mixins:[mensagensMixin],
    props:[],
    data() {
        return {
            modalShow: false,
            loading: false,
            filter:"",
            api: new ApiFac(),
            fields:[
                {key: "id", label: "ID", sortable: true},
                {key: "nome", label: "Nome", sortable: true},
                {key: "telefone", label: "Telefone", sortable: true},
                {key: "email", label: "E-mail", sortable: true},
                {key: "estado", label: "estado", sortable: true},
                {key: "acoes", label: "Ações", sortable: false},
            ],
            itens:[],
            cliente:{id:-1, nome:"", telefone:"", email:"", estado:true}
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
        async iniciar(){
            try {
                this.loading = true
                const clientes = await this.api.getCliente(-1)
                this.itens = clientes
            } catch (error) {
                alert(error)
            } finally{
                this.loading = false
            }
        },
        abrirModal(){
            //this.cliente = this.cliente.assign({}, {})
            this.cliente = {}
            this.cliente.id = -1
            this.modalShow = true
        },
        fecharModal(){
            this.modalShow = false
        }, 
        async guardar(){
            try {
                const resposta = await this.api.saveCliente(this.cliente)
                console.log(resposta)
                if(resposta.id != undefined){
                    this.mensagem("Cliente salvo com sucesso!")
                    this.cliente = []
                } else {
                    this.mensagemErro("Erro inesperado")
                }
            } catch (error) {
                this.mensagemErro(error)
            } finally{
                this.fecharModal()
                this.iniciar()
            }
        },
        editar(umCliente){
            this.cliente = umCliente
            this.modalShow = true
        },
        async apagar(umCliente){
            try {
                if(await this.mensagemPergunta(`${umCliente.nome}`, "Apagar cliente")){
                    this.loading = true
                    await this.api.deleteCliente(umCliente.id)
                    this.mensagem("Cliente apagado")
                    this.iniciar()
                }
            } catch (error) {
                this.mensagemErro(error)
            } finally{
                this.loading = false
                this.iniciar
            }
        }
    },
    computed:{

    }
}
</script>


<style>

</style>

