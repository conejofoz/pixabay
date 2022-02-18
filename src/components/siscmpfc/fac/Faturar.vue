<template>
    <b-container fluid>
        <!-- 
            MODAL DE CONSULTA POR NOME
         -->
         <b-modal
            id="modal"
            v-model="modalShow"
            size="lg"
            title="Clientes"
            no-close-on-backdrop
            no-close-on-esc
            header-bg-variant="success"
            ok-only
            ok-variant="info"
            ok-title="Sair"
            >
            <b-container fluid>
                <b-row>
                    <b-col>
                        <b-card title="Buscar">
                            <b-row>
                                <b-col sm="11">
                                    <b-form-input v-model="searchModal" type="text" autofocus @keypress.enter="buscarClientePorNome"></b-form-input>
                                </b-col>
                                <b-col sm="1">
                                    <b-button pill variant="success" size="sm" @click="buscarClientePorNome">
                                        <b-icon-search></b-icon-search>
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-card title="Resultados">
                            <b-overlay :show="loading" spinner-variant="primary" rounded="sm">
                                <b-table
                                    label-sort-asc=""
                                    label-sort-desc=""
                                    label-sort-clear=""
                                    dense
                                    striped
                                    hover
                                    :items="buscado"
                                    primary-key="id"
                                    small 
                                    sticky-header
                                    head-variant="dark"
                                    fixed
                                    responsive="sm"
                                    :busy="loading"
                                    show-empty
                                    emptyText="Sem dados para mostrar"
                                    emptyFilteredText = "Nenhum registro encontrado"
                                    @row-clicked="(item)=> clickBuscar(item)"
                                >
                                    
                                </b-table>

                            </b-overlay>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>

         </b-modal>

        <b-overlay :show="loading" spinner-variant="primary" rounded="sm">
        <template v-slot:overlay>
            <div class="text-center">
                <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
                <p id="cancel-label">Aguarde um momento por favor...</p>
            </div>
        </template>

        <!-- 
            BARRA BOTÕES CONSULTAR VENDA E NOVA VENDA
         -->
         <b-row>
             <b-col>
                 <b-navbar toogleable="lg" variant="info" sticky>
                     <b-navbar-nav>
                         <b-btn-toolbar>
                             <b-btn variant="danger" @click="buscar">
                                 <b-icon icon="search"></b-icon>
                             </b-btn>
                         </b-btn-toolbar>
                         <b-btn-toolbar>
                             <b-btn variant="warning" @click="nova">
                                 <b-icon icon="basket3"></b-icon>
                             </b-btn>
                         </b-btn-toolbar>
                     </b-navbar-nav>
                 </b-navbar>
             </b-col>
         </b-row>



        <!-- 
            CABEÇALHO DA VENDA
         -->
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
            <b-col sm="1">
                <!-- <b-form-select v-model="cabecalho.cliente" :options="clientes" value-field="id" text-field="nome"></b-form-select> -->
                <b-form-input v-model="cabecalho.cliente.id" @keypress.enter="buscarCliente" autofocus ref="cliente" ></b-form-input> 
            </b-col>
            <b-col>
                <b-form-input v-model="cabecalho.cliente.nome" disabled></b-form-input>
            </b-col>

            <b-col sm="1">
                <b-button @click="abrirModal" variant="success" :disabled="cabecalho.id!=-1">
                    <b-icon-people></b-icon-people>
                </b-button>
            </b-col>
        </b-row>

        <!-- 
            INFORMAR O PRODUTO 
         -->
        <b-row>
            <b-col>
                <b-card
                    title="Produtos"
                    class="md-2"
                >
                    <b-row>
                        <b-col sm="1">
                            <b-form-input v-model="detalhe.produto" @keypress.enter="buscarProduto" ref="idproduto" id="idproduto"></b-form-input>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input v-model="detalhe.descricao" disabled></b-form-input>
                        </b-col>
                        <b-col sm="2">
                            <b-form-input v-model="detalhe.quantidade" @keypress.enter="verificaQuantidade" type="number" min="1" value="1" ref="quantidade"></b-form-input>
                        </b-col>
                        <b-col sm="2">
                            <b-form-input v-model="detalhe.preco" type="number"></b-form-input>
                        </b-col>
                        <b-col sm="1">
                            <b-btn block variant="info" ref="save">
                                <b-icon icon="cart-plus" @click="save"></b-icon>
                            </b-btn>
                        </b-col>
                    </b-row>

                </b-card>
            </b-col>
        </b-row>

        <!-- 
            TABELA DOS ITENS DA VENDA
         -->
        <b-row>
            <b-table
                label-sort-asc=""
                label-sort-desc=""
                label-sort-clear=""
                dense
                striped
                hover
                :items="itens"
                :fields="fields"
                primary-key="id"
                small 
                sticky-header
                head-variant="dark"
                responsive="sm"
                :busy="loading"
                show-empty
                emptyText="Não existe dados cadastrados"
                emptyFilteredText = "Nenhum registro encontrado"
                foot-clone
            >

            <template v-slot:cell(acoes)="row">
                <b-icon icon="trash" size="sm" @click="apagarDetalhe(row.item)" class="mr-1"></b-icon>
            </template>

            <template v-slot:foot()>
                <span></span>
            </template>
                
            <template v-slot:foot(produto_descricao)>
                <span class="text-danger">Totais</span>
            </template>
                
            <template v-slot:foot(quantidade)>
                <span class="text-danger">{{totais.quantidade}}</span>
            </template>
                
            <template v-slot:foot(subtotal)>
                <span class="text-danger">{{totais.subtotal}}</span>
            </template>
                
            <template v-slot:foot(desconto)>
                <span class="text-danger">{{totais.desconto}}</span>
            </template>
                
            <template v-slot:foot(total)>
                <span class="text-danger">{{totais.total}}</span>
            </template>
                
            </b-table>
        </b-row>
        </b-overlay>
    </b-container>
</template>


<script>
import { ApiFac} from './ApiFac'
import { ApiInv} from '../inv/ApiInv'
import mensagemMixin from '../../../mixins/mensagensMixin.js'
import moment from 'moment'
export default {
    name:"Faturar",
    components:{

    },
    mixins:[mensagemMixin],
    props:[],
    data() {
        return {
            searchModal:"",
            modalShow:false,
            buscado:[],
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
                //data: new Date().toLocaleString(),
                data: moment().format("DD/MM/YYYY"),
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
            produtosVenda:[
                {venda:-1, produto:15,quantidade:1, preco:10, desconto:0, subtotal:100, total:1000},
                {venda:-1, produto:16,quantidade:2, preco:20, desconto:0, subtotal:200, total:2000},
                {venda:-1, produto:17,quantidade:3, preco:30, desconto:0, subtotal:300, total:3000}
            ],
            fields:[
                {key: "id", label:"ID", sortable:true},
                {key: "produto_descricao", label:"Produto", sortable:true},
                {key: "quantidade", label:"Quantidade", sortable:true},
                {key: "preco", label:"Preço", sortable:true},
                {key: "subtotal", label:"subtotal", sortable:true},
                {key: "desconto", label:"desconto", sortable:true},
                {key: "total", label:"total", sortable:true},
                {key: "acoes", label:"Ações"},
            ]
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
        async iniciar(){
            try {
                this.loading = true
                const clientes = await this.api.getCliente()
                this.clientes = clientes
                this.nova()
                this.$refs.cliente.focus()
                this.$refs.cliente.select()
                this.loading = false
            } catch (error) {
                this.$swal("Error", error.toString())                
            } finally{
                this.loading = false
            }
        },
        async buscarCliente(){
            try {
                this.loading = true
                const cliente = await this.api.getCliente(this.cabecalho.cliente.id)
                if(cliente.detail !=undefined){
                    this.$swal("Erro", cliente.detail)     
                    this.cabecalho.cliente = {id:-1}           
                } else if(!cliente.estado){
                    this.$swal("Erro", "Cliente inativo")     
                    this.cabecalho.cliente = {id:-1}  
                } else {
                    this.cabecalho.cliente = cliente
                    this.$refs.idproduto.focus()
                    this.$refs.idproduto.select()
                }
                this.loading = false
            } catch (error) {
                this.$swal("Erro", error.toString())  
            } finally{
                this.loading = false
            }
            /* const d = await this.api.getClienteByName('ggg')
            console.log('....... ', d) */
        },
        async buscarClientePorNome(){
            try {
                this.loading = true
                this.buscado = []
                console.log(this.searchModal)
                if(this.searchModal!=""){
                    const d = await this.api.getClienteByName(this.searchModal)
                    console.log(d)
                    if(d.detail != undefined){
                        this.$swal("Erro", d.detail)          
                    } else {
                        this.buscado = d
                    }
                }
                this.loading = false
            } catch (error) {
                this.$swal("Erro", error.toString())  
            } finally{
                this.loading = false
            }
            /* const d = await this.api.getClienteByName('ggg')
            console.log('....... ', d) */
        },
        async clickBuscar(item){
            this.cabecalho.cliente.id = item.id
            await this.buscarCliente()
            this.modalShow = false
        },
        abrirModal(){
            this.buscado = []
            this.searchModal = ""
            this.modalShow = true
        },
        async buscarProduto(){
            if(this.detalhe.produto > 0){
                try {
                    this.loading = true
                    const p = await this.api.getProdutos(this.detalhe.produto)
                    if(p.id!== undefined){
                        if(p.stock>0){
                            this.detalhe.produto = p.id
                            this.detalhe.descricao = p.descricao
                            this.detalhe.preco = p.preco
                            this.$refs.quantidade.focus()
                            this.$refs.quantidade.select()
                        } else {
                            this.mensagemErro(`Quantidade insuficiente ${p.stock}`)
                            //this.detalhe = {}
                            this.limparDetalhe()
                        } 
                    } else {
                        this.mensagemErro(p.detail)
                        //this.detalhe = {}
                        this.limparDetalhe()
                    }
                    this.loading = false
                } catch (error) {
                    this.$swal("Erro", error.toString())  
                } finally{
                    this.loading = false
                    //this.$refs.quantidade.focus();
                }
            }
        },
        async save_ok(){
            let dataFatura = this.cabecalho.data
            dataFatura = moment(dataFatura, 'DD/MM/YYYY').format('YYYY-MM-DD')
            if(this.cabecalho.cliente.id ===undefined
                || this.cabecalho.cliente.id ===null
                || this.cabecalho.cliente.nome ==""
                || this.cabecalho.cliente.id <1
            ){
                this.mensagemErro("Cliente é obrigatório!")
                return false
            }
            if(this.detalhe.descricao ===undefined
                || this.detalhe.descricao ==""
            ){
                this.mensagemErro("Produto é obrigatório!")
                return false
            }
            if(this.detalhe.quantidade ===undefined
                || this.detalhe.quantidade <=0
            ){
                this.mensagemErro("Verifique a quantidade informada")
                return false
            }

            try {
                this.loading = true
                const enc = {
                    id: this.cabecalho.id,
                    cliente: this.cabecalho.cliente.id,
                    data: dataFatura
                }

                const obj = new FormData()
                for (const key in enc) {
                    obj.append(key, enc[key])
                }


                const f = await this.api.saveVenda(obj)
                if(f.id===undefined){
                    this.mensagemErro(`Falha ao gravar o cabeçalho da venda: ${f} `)
                } else {
                    let id = f.id
                    const det = {
                        id:-1,
                        venda: id,
                        produto: this.detalhe.produto,
                        quantidade: this.detalhe.quantidade,
                        preco: this.detalhe.preco,
                        desconto: this.detalhe.desconto
                    }
                    console.log('det ',det)
                    console.log('f ',f)
                    const objDet = new FormData()
                    for (const key in det) {
                        objDet.append(key, det[key])
                    }

                    try {
                        const d = await this.api.saveDetalheVenda(objDet)
                        if(d.id===undefined){
                            this.mensagemErro(`Falha ao gravar o detalhe da venda: ${d} `)
                            this.cabecalho.id = f.id
                            this.refresh()
                        } else {
                            //this.detalhe = {id:-1}
                            this.limparDetalhe()
                            this.cabecalho = f
                            this.cabecalho.cliente = await this.api.getCliente(this.cabecalho.cliente)
                            this.cabecalho.data = moment(dataFatura, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        }
                        
                    } catch (error) {
                        this.$swal("Erro det", error) 
                    }
                    
                }

            } catch (error) {
                    this.$swal("Erro Venda", error)  
                } finally{
                    this.loading = false
                    this.refresh()
                }
        },
        async save(){
            let dataFatura = this.cabecalho.data
            dataFatura = moment(dataFatura, 'DD/MM/YYYY').format('YYYY-MM-DD')
            if(this.cabecalho.cliente.id ===undefined
                || this.cabecalho.cliente.id ===null
                || this.cabecalho.cliente.nome ==""
                || this.cabecalho.cliente.id <1
            ){
                this.mensagemErro("Cliente é obrigatório!")
                return false
            }
            if(this.detalhe.descricao ===undefined
                || this.detalhe.descricao ==""
            ){
                this.mensagemErro("Produto é obrigatório!")
                return false
            }
            if(this.detalhe.quantidade ===undefined
                || this.detalhe.quantidade <=0
            ){
                this.mensagemErro("Verifique a quantidade informada")
                return false
            }

            try {
                this.loading = true
                const enc = {
                    id: this.cabecalho.id,
                    cliente: this.cabecalho.cliente.id,
                    data: dataFatura,
                    //produtos:JSON.stringify(this.produtosVenda)
                }

                console.clear()
                console.log(enc)
                //return false

                const obj = new FormData()
                for (const key in enc) {
                    obj.append(key, enc[key])
                }
                obj.append('produtos', JSON.stringify(this.produtosVenda))


                const f = await this.api.saveVenda(obj)
                if(f.id===undefined){
                    this.mensagemErro(`Falha ao gravar o cabeçalho da venda: ${f} `)
                } else {
                    let id = f.id
                    const det = {
                        id:-1,
                        venda: id,
                        produto: this.detalhe.produto,
                        quantidade: this.detalhe.quantidade,
                        preco: this.detalhe.preco,
                        desconto: this.detalhe.desconto
                    }
                    console.log('det ',det)
                    console.log('f ',f)
                    const objDet = new FormData()
                    for (const key in det) {
                        objDet.append(key, det[key])
                    }

                    try {
                        const d = await this.api.saveDetalheVenda(objDet)
                        if(d.id===undefined){
                            this.mensagemErro(`Falha ao gravar o detalhe da venda: ${d} `)
                            this.cabecalho.id = f.id
                            this.refresh()
                        } else {
                            //this.detalhe = {id:-1}
                            this.limparDetalhe()
                            this.cabecalho = f
                            this.cabecalho.cliente = await this.api.getCliente(this.cabecalho.cliente)
                            this.cabecalho.data = moment(dataFatura, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        }
                        
                    } catch (error) {
                        this.$swal("Erro det", error) 
                    }
                    
                }

            } catch (error) {
                    this.$swal("Erro Venda", error)  
                } finally{
                    this.loading = false
                    this.refresh()
                }
        },
        async refresh(){
            try {
                this.loading = true
                const r = await this.api.getVenda(this.cabecalho.id)
                
                if(r.detail != undefined){
                    this.mensagemErro(r.detail)
                    //this.cabecalho = {id:-1, cliente:{id:-1, nome:""},data: moment().format("DD/MM/YYYY")}
                    this.nova()
                } else {
                    this.cabecalho = r
                    this.cabecalho.cliente = await this.api.getCliente(this.cabecalho.cliente)
                    this.cabecalho.data = moment(r.data, 'YYYY-MM-DD').format('DD/MM/YYYY')
                    this.itens = r.detalhe
                }
            } catch (error) {
                this.mensagemErro(`Erro ao refrescar a venda: ${error}`)
            } finally{
                this.loading = false
            }
        },
        limparDetalhe(){
            this.detalhe = {
                id:-1,
                venda:-1,
                produto:-1,
                quantidade:0,
                preco:0,
                subtotal:0,
                desconto:0,
                total:0
            }
        },
        limpaCabecalho(){
            this.cabecalho = {id:-1, cliente:{id:-1, nome:""},data: moment().format("DD/MM/YYYY")}
        },
        verificaQuantidade(){
            //por momento só clica em salvar
            this.$refs.save.click()
            console.log('verificaquantidade')
        },
        async buscar(){
            const {value: idEnc} = await this.$swal.fire({
                title: "Digite o número da venda",
                input: 'text',
                allowOutsideClick: false,
                showCancelButton:true,
                inputValidator: (value)=>{
                    if(!value){
                        return 'Deve digitar o numero da fatura'
                    }
                }
            })

            if(idEnc){
                this.cabecalho.id = idEnc
                await this.refresh()
                if(this.cabecalho.id===undefined){
                    this.limpaCabecalho()
                    this.$swal("Fatura não encontrada", idEnc, "error")
                }
            }else{
                this.$swal("Busca cancelada", "", "warning")
            }
        },
        nova(){
            this.limpaCabecalho()
            this.limparDetalhe()
            this.editar = false
            this.itens = []
        },
        async apagarDetalhe(item){
            if(await this.mensagemPergunta(`${item.produto_descricao}?`, "Apagar")){
                await this.api.deleteDetalhe(item.id)
                this.refresh()
            }
        }
    },
    computed:{
        totais(){
            let t = {
                quantidade: 0,
                subtotal: 0, 
                desconto: 0,
                total: 0
            }
            if(this.itens!=undefined){
                this.itens.reduce((i, obj)=>{
                    t.quantidade += obj.quantidade
                    t.subtotal += obj.subtotal
                    t.desconto += obj.desconto
                    t.total += obj.total
                }, 0)
            }
            return t
        }
    }
}
</script>


<style scoped>

</style>

