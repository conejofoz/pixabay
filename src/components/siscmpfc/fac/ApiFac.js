import Api from '../Api.js'

const contexto = "cliente"
//const contexto = "clientest"
const ctxDet = "vendas-detalhe"
const ctxVenda = "vendas"


export class ApiFac extends Api{
    
    constructor(){
        super()
    }

    async getCliente(id=-1){
        return await super.get(contexto, id)
    }

    async saveCliente(obj){
        return await super.save(contexto, obj)
    }

    async deleteCliente(id){
        return await super.delete(contexto, id)
    }
   
   
    async getVenda(id=-1){
        return await super.get(ctxVenda, id)
    }

    async saveVenda(obj){
        return await super.save(ctxVenda, obj)
    }

    async saveDetalheVenda(obj){
        return await super.save(ctxDet, obj)
    }

    async deleteDetalhe(id){
        return await super.delete(ctxDet, id)
    }
    async getClienteByName(termo){
        return await super.get("cliente/by-name", termo)
    }
    async getProdutoByName(termo){
        return await super.get("produto/by-descricao", termo)
    }
    async getProdutos(id){
        return await super.get("produto", id)
    }
}