<template>
    <b-container fluid>
        <!-- 
            MODAL CONSULTA DE CLIENTE POR NOME
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

                                <template #cell(imagem)="row">
                                    <img :src="mostraImagem(row.item.imagem)" style="max-width:40px" alt="" srcset="">
                                </template>
                                    
                                </b-table>

                            </b-overlay>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>

         </b-modal>
        <!-- 
            MODAL CONSULTA DE PRODUTOS
         -->
         <b-modal
            id="modalConsultaProdutos"
            v-model="modalConsultaProdutosShow"
            size="lg"
            title="Produtos"
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
                                    <b-form-input v-model="searchProdutosModal" type="text" autofocus @keypress.enter="buscarProdutosPorNome"></b-form-input>
                                </b-col>
                                <b-col sm="1">
                                    <b-button pill variant="success" size="sm" @click="buscarProdutosPorNome">
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
                                    :items="buscadoProduto"
                                    :fields="fieldsProdutos"
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
                                    @row-clicked="(item)=> clickBuscarProduto(item)"
                                >

                                <template #cell(imagem)="row">
                                    <img :src="mostraImagem(row.item.imagem)" style="max-width:40px" alt="" srcset="">
                                </template>
                                    
                                </b-table>

                            </b-overlay>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>

         </b-modal>
         <!-- fim consulta produtos -->

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
                             <b-btn class="mr-1" variant="danger" @click="buscar">
                                 <b-icon icon="search"></b-icon>Consultar Venda
                             </b-btn>
                         </b-btn-toolbar>
                         <b-btn-toolbar>
                             <b-btn variant="warning" @click="nova">
                                 <b-icon icon="basket3"></b-icon>Nova Venda
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
                        <b-col sm="1">
                            <b-btn block variant="warning" @keydown.enter="modalConsultaProdutosShow=true" @click="modalConsultaProdutosShow=true">
                                <b-icon icon="binoculars"></b-icon>
                        </b-btn>
                        </b-col>
                        <b-col sm="5">
                            <b-form-input v-model="detalhe.descricao" disabled></b-form-input>
                        </b-col>
                        <b-col sm="2">
                            <b-form-input v-model="detalhe.quantidade" @keypress.enter="verificaQuantidade" type="number" min="1" value="1" ref="quantidade"></b-form-input>
                        </b-col>
                        <b-col sm="2">
                            <b-form-input v-model="detalhe.preco" @keypress.enter="verificaPreco" type="number" ref="preco"></b-form-input>
                        </b-col>
                        <b-col sm="1">
                            <b-btn block variant="info" ref="addItemGrade" @keydown.enter="addItemGrade" @click="addItemGrade">
                                <!-- <b-icon icon="cart-plus" @click="save"></b-icon> -->
                                <b-icon icon="cart-plus"></b-icon>
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
                <b-icon icon="trash" size="sm" @click="apagarDetalhe(row)" class="mr-1"></b-icon>
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
        <b-btn block variant="success" ref="save" @click="save">
           <b-icon icon="plus" ></b-icon>Gravar a venda
         </b-btn>
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
            img_url:null,
            searchModal:"",
            modalShow:false,
            modalConsultaProdutosShow:false,
            buscado:[],
            buscadoProduto:[],
            api: new ApiFac(),
            apiInv: new ApiInv(),
            editar: false,
            loading:false,
            search:"",
            searchProdutosModal:"",
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
                descricao:'',
                quantidade:0,
                preco:0,
                subtotal:0,
                desconto:0,
                total:0
            },
            itens:[],
            produtosVenda:[
                //{id: -1, venda:-1, produto:5,quantidade:1, preco:10, desconto:0, subtotal:100, total:1000},
                //{id: -1, venda:-1, produto:6,quantidade:2, preco:20, desconto:0, subtotal:200, total:2000},
                //{id: -1, venda:-1, produto:7,quantidade:3, preco:30, desconto:0, subtotal:300, total:3000}
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
            ],
            fieldsProdutos:[
                {key: "id", label:"ID", sortable:true},
                {key: "descricao", label:"Descrição", sortable:true},
                {key: "stock", label:"Estoque", sortable:true},
                {key: "preco", label:"Preço", sortable:true},
                {key: "subcat_descricao", label:"Sub Categoria", sortable:false},
                {key: "imagem", label:"Foto", sortable:false},
            ]
        }
    },
    created() {
        this.iniciar()
    },
    methods: {
        mostraImagem(obj){
            console.log(obj)
            let result = ''
            if(obj){
                result = this.img_url + obj
            } else {
                result = this.img_url + 'media/img/empty.png'
            }
            return result
        },
        async iniciar(){
            try {
                this.loading = true
                const clientes = await this.api.getCliente()
                this.img_url = this.api.IMG_URL
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
                    //this.$refs.idproduto.focus()
                    //this.$refs.idproduto.select()
                    this.focarProduto()
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
        async buscarProdutosPorNome(){
            try {
                this.loading = true
                this.buscadoProduto = []

                if(this.searchProdutosModal != ""){
                    const produtos = await this.api.getProdutoByName(this.searchProdutosModal)
                    if(produtos.detail != undefined){
                        this.$swal("Erro:", produtos.detail)
                    } else {
                        this.buscadoProduto = produtos
                    }
                }
            } catch (error) {
                this.$swal("Erro", error.toString())
            } finally{
                this.loading = false
            }
        },
        async clickBuscar(item){
            await this.fecharmodalConsultaClientes()
            this.cabecalho.cliente.id = item.id
            await this.buscarCliente()
        },
        async clickBuscarProduto(item){
            await this.fecharmodalConsultaProdutos()
            this.detalhe.produto = item.id
            await this.buscarProduto()
        },
        abrirModal(){
            this.buscado = []
            this.searchModal = ""
            this.modalShow = true
        },
        async buscarProduto(){
            if(this.detalhe.produto ==""){
                this.modalConsultaProdutosShow = true
            }
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
                            //await this.mensagemErro(`Quantidade insuficiente ${p.stock}`)
                            this.$toastr.w(`Quantidade insuficiente ${p.stock}`);
                            await this.limparDetalhe()
                            await this.focarProduto()
                        } 
                    } else {
                        this.mensagemErro(p.detail)
                        this.limparDetalhe()
                    }
                    this.loading = false
                } catch (error) {
                    this.$swal("Erro", error.toString())  
                } finally{
                    this.loading = false
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
            /* if(this.detalhe.descricao ===undefined
                || this.detalhe.descricao ==""
            ){
                this.mensagemErro("Produto é obrigatório!")
                return false
            } */
            if(this.itens.length <=0){
                this.$refs.idproduto.focus()
                this.$refs.idproduto.select()
                this.mensagemErro("Produto é obrigatório!")
                return false
            }
            

            try {
                this.loading = true
                const enc = {
                    id: this.cabecalho.id,
                    cliente: this.cabecalho.cliente.id,
                    data: dataFatura,
                    produtos:JSON.stringify(this.itens)
                }

                console.clear()
                console.log(enc)
                //return false

                const obj = new FormData()
                for (const key in enc) {
                    obj.append(key, enc[key])
                }
                ////obj.append('produtos', JSON.stringify(this.produtosVenda))
                //obj.append('produtos', JSON.stringify(this.itens))

                const venda = await this.api.saveVenda(obj)

                if(venda.id===undefined){
                    this.mensagemErro(`Falha ao gravar o cabeçalho da venda: ${venda} `)
                } else {

                    //
                    
                    this.cabecalho.id = venda.id
                    await this.refresh()
                    this.$toastr.s(`Venda gravada ${venda.id}`);
                    //this.limparDetalhe()
                    //




                    /* 
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
                     */
                }

            } catch (error) {
                    //this.$swal("Erro Venda", error)  
                    this.mensagemErro(`Falha ao gravar venda: `, error.toString())
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
        async focarProduto(){
            /* Depois de sair de um modal não funciona o focus
               tive que usar o setTimeout e colocar o fechamento do modal 
               em uma função async await
             */
            setTimeout(()=>{
                this.$refs.idproduto.focus()
                this.$refs.idproduto.select()

            },100)
        },
        async focarCliente(){
            /* Depois de sair de um modal não funciona o focus */
            setTimeout(()=>{
                this.$refs.cliente.focus()
                this.$refs.cliente.select()

            },100)
        },
        async fecharmodalConsultaProdutos(){
            this.modalConsultaProdutosShow = false
        },
        async fecharmodalConsultaClientes(){
            this.modalShow = false
        },
        async limparDetalhe(){
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
            this.$refs.preco.focus()
            this.$refs.preco.select()
        },
        verificaPreco(){
            this.$refs.addItemGrade.focus()
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
            console.log(item)
            if(await this.mensagemPergunta(`${item.index + 1}º ${item.item.produto_descricao}?`, "Apagar o item")){
                //await this.api.deleteDetalhe(item.id)
                //this.refresh()
                if(this.cabecalho.id ==-1){
                    this.itens.splice(item.index,1)
                } else {
                    this.$toastr.e(`Não é permitido remover item de uma venda realizada ${this.cabecalho.id}`);
                }
            }
        },
        async addItemGrade(){
            if(this.detalhe.quantidade ===undefined
                || this.detalhe.quantidade <=0
            ){
                this.$refs.quantidade.select()
                this.mensagemErro("Verifique a quantidade informada")
                return false
            }

            let aux = {}
            aux.id = this.detalhe.produto
            aux.produto = this.detalhe.produto
            aux.produto_descricao = this.detalhe.descricao
            aux.quantidade = this.detalhe.quantidade
            aux.preco = this.detalhe.preco
            aux.subtotal = aux.quantidade * aux.preco
            aux.desconto = 0
            aux.total = aux.subtotal - aux.desconto
            this.itens.push(aux)
            await this.limparDetalhe()

            this.$refs.idproduto.focus()
            this.$refs.idproduto.select()
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

