export default class Api{
    constructor(){
        this.SERVER_URL = 'http://192.168.0.116:8000/rest/v1/'
        this.TOKEN_URL = this.SERVER_URL + 'token/'
        this.USUARIO = 'conejofoz'
        this.PASSWORD = '1234567.'
        this.credenciais = { username: this.USUARIO, password:this.PASSWORD}
    }


    async getToken(){
        const resposta = await fetch(this.TOKEN_URL,{method:"POST", body:JSON.stringify(this.credenciais), mode:"cors", headers:{'Content-Type': 'application/json'}})
        const token = await resposta.json()
        return token
    }


    async get(recurso, id=-1){
        const token = await this.getToken()
        let url = this.SERVER_URL + recurso + '/'

        if(id !== -1){
            url += id + '/'
        }

        const resposta = await fetch(url, {method: "GET",headers:{'Content-Type': 'application/json', 'Authorization': "Bearer " + token.access}})
        const itens = await resposta.json()

        if(itens.results===undefined){
            return itens
        }
        return itens.results
    }


    async save(recurso, obj){
        const token = await this.getToken()
        let url = this.SERVER_URL + recurso +"/"
        let method = "POST"
        
        if(obj.id !== -1){
            method = "PUT"
            url += obj.id + "/"
        }

        console.log("Esto se passa em save()")
        let resposta = await fetch(url, {method: method, body:JSON.stringify(obj), headers:{'Content-Type': 'application/json', 'Authorization': "Bearer " + token.access,}})

        if(!resposta.ok){
            return resposta.statusText
        }

        const data = await resposta.json()
        return data
    }


    async delete(recurso, id){
        const token = await this.getToken()
        let url = this.SERVER_URL + recurso + "/" + id + "/"

        fetch(url, {method: "DELETE",headers:{'Content-Type': 'application/json', 'Authorization': "Bearer " + token.access,}})
        .catch(error => console.log('Error: ', error))
    }
}