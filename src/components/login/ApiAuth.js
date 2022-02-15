export class ApiAuth{

    constructor(){
        this.SERVER_URL = process.env.VUE_APP_SERVER_URL
        this.TOKEN_URL = this.SERVER_URL + 'token/'
        this.REFRESH_URL = this.TOKEN_URL + 'refresh/'
        this.credenciais = ""
    }


    async login(user, pass){
        this.credenciais = {username:user, password: pass}
        let token = null
        try {
            const r = await fetch(this.TOKEN_URL,
                {
                    method: "POST", 
                    body:JSON.stringify(this.credenciais),
                    mode:"cors",
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                token = await r.json()
        } catch (error) {
            token = {error:error.toString()}
        }
        return token;
    }


    async getToken(){
        /* 
        Antes o token era pego na api, agora é pego no localstorage
        Agora o loguin é que pega o token na api e armazena no localstorage
        Esse procedimento foi feito para não ter que ir na api bucar o token a cada requisição
        Feito isso somente se o acces e o refresh serem inválidos, vencidos ou não existirem
        */
        let access = localStorage.getItem("access")
        const REFRESH = localStorage.getItem("refresh")
        let token = ""
        if(this.tokenExpired(access)){
            token = await this.refreshToken(REFRESH)
            if(token == null){
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                access = null
            } else {
                access = token.access
                localStorage.setItem("access", access)
            }
        }

        /* Passou a ser verificado se existe na rota */
        //if(access==null || REFRESH==null){
        //    window.location.href="login"
        //}
        token = {access:access, refresh:REFRESH}
        return token
    }


    decodeToken = (token) =>{
        try {
            return JSON.parse(atob(token.split('.')[1]))
        } catch (error) {
            return null
        }
    }


    tokenExpired(token){
        token = this.decodeToken(token)
        let expired = false

        if(token!=null){
            var current_time = Date.now() /1000
            if(token.exp < current_time){
                expired = true
            }
        } else {
            expired = true
        }

        return expired
    }


    async refreshToken(refresh){
        const data = {refresh:refresh}
        let token = null
        try {
            const r = await fetch(this.REFRESH_URL,{method:"POST", body:JSON.stringify(data), mode:"cors", headers:{'Content-Type': 'application/json'}})
            token = await r.json()
        } catch (error) {
            console.log(error.toString())
            token = null
        }
        return token
    }

}