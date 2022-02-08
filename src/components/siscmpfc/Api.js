import axios from 'axios'


export default class Api{
    constructor(){
        //this.SERVER_URL = 'http://192.168.1.191:8000/rest/v1/'
        this.SERVER_URL = 'http://192.168.0.16:8000/rest/v1/'
        //this.IMG_URL = 'http://192.168.1.191:8000/'
        this.IMG_URL = 'http://192.168.0.16:8000/'
        this.TOKEN_URL = this.SERVER_URL + 'token/'
        this.USUARIO = 'conejofoz'
        this.PASSWORD = '1234567.'
        this.credenciais = { username: this.USUARIO, password:this.PASSWORD}
    }

    async getToken(){
        const resposta = await fetch(
                                    this.TOKEN_URL,
                                    {
                                        method:"POST", 
                                        body:JSON.stringify(this.credenciais), 
                                        mode:"cors", 
                                        headers:{'Content-Type': 'application/json'
                                    }
                                })
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
            //return itens.dados //django retorando json - dados é o nome dado ao retorno lá do django poderia ser abacate
            return itens //django-rest framework
        }
        return itens.results
       
    }

    async saveNormalSemFotoApi(recurso, obj){
        const token = await this.getToken()
        let url = this.SERVER_URL + recurso +"/"
        let method = "POST"
        
        if(obj.id !== -1){
            method = "PUT"
            url += obj.id + "/"
        }

        try {
            let resposta = await fetch(url, {method: method, body:JSON.stringify(obj), headers:{'Content-Type': 'application/json', 'Authorization': "Bearer " + token.access,}})

            console.log('resposta pura: ', resposta)
            if(!resposta.ok){
                console.log('resposta do if: ', resposta.statusText)
                return resposta.statusText
                //return resposta
            }
    
            //const data = await resposta
            const data = await resposta.json()
            console.log('data: ', data)
            return data
        } catch (error) {
            console.log(error)            
        }

    }

    async save(recurso, obj){
        console.log('Objeto antes de gravar: ', obj)
        console.log('Valor do id: ', obj.get('id'))
        /* 
        Função modificada para fazer o upload da imagem ja na hora do cadastro
        Todos os componentes terão que converter seus objetos para formdata para serializar a imagem junto com os dados
            pois antes estava trabalhando com application/json, agora multipart/form-data
         */
        const token = await this.getToken()
        let url = this.SERVER_URL + recurso +"/"
        //let method = "POST"
        
        //if(obj.id !== -1){
            //method = "PUT"
           // url += obj.id + "/"
       // }
        if(obj.get('id') != -1){
            //method = "PUT"
            url += obj.get('id') + "/"
        }

        try {

            //let resposta = await fetch(url, {method: method, body:JSON.stringify(obj), headers:{'Content-Type': 'application/json', 'Authorization': "Bearer " + token.access,}})

            let resposta = null

            if(obj.get('id') == -1){
                resposta = await axios.post(url, 
                    obj,
                    {headers:{'Content-Type': 'multipart/form-data', 'Authorization': "Bearer " + token.access}}, 
                    {
                        onUploadProgress: uploadEvent =>{
                        console.log('Upload Progress: ' + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + '%')
                    }
                })
                .then(res =>{
                    console.log('res', res)
                    return res //jogou o res para o resposta
                })

            } else {
                resposta = await axios.put(url, 
                    obj,
                    {headers:{'Content-Type': 'multipart/form-data', 'Authorization': "Bearer " + token.access}}, 
                    {
                        onUploadProgress: uploadEvent =>{
                        console.log('Upload Progress: ' + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + '%')
                    }
                })
                .then(res =>{
                    console.log('res', res)
                    return res //jogou o res para o resposta
                })

            }

            // 


            console.log('resposta pura: ', resposta)
            
            //if(!resposta.data.ok){ //axios não tem o propriedade ok
            //    console.log('resposta do if: ', resposta.data.statusText)
            //    return resposta.data.statusText
                //return resposta
            //}
    
            
            //const data = await resposta.json()
            //console.log('data: ', data)
            //return data
            return resposta.data
        } catch (error) {
            console.log(error)            
        }

    }

    async delete(recurso, id){
        const token = await this.getToken()
        let url = this.SERVER_URL + recurso + "/" + id + "/"

        fetch(url, {method: "DELETE",headers:{'Content-Type': 'application/json', 'Authorization': "Bearer " + token.access,}})
        .catch(error => console.log('Error: ', error))
    }
}