import Api from '../Api'

export class ApiCmp extends Api{
    constructor(){
        super()
    }

    async getFornecedores(id=-1){
        return await super.get('fornecedor', id)
    }

    async saveFornecedor(obj){
        return await super.save('fornecedor', obj)
    }

    async delFornecedor(id){
        return await super.delete('fornecedor', id)
    }


    async get(id=-1){
        return await super.get('compras', id)
    }

    async saveCompra(obj){
        return await super.save('compras', obj)
    }

    async saveDetalhe(obj){
        return await super.save('compras-detalhe', obj)

    }
    async delDetalhe(id){
        return await super.delete('compras-detalhe', id)
    }
}