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
}