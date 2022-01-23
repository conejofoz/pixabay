const SERVER_URL = 'http://localhost:8000/rest/v1/'
const DOCS_URL = SERVER_URL + 'docs/'
const TOKEN_URL = SERVER_URL + 'token/'
const USUARIO = 'conejofoz'
const PASSWORD = '1234567.'
const credenciales = {"username": USUARIO, "password": PASSWORD}


const getToken = async ()=>{

    const resposta = await fetch(TOKEN_URL, 
        {
            method="POST",
            body=JSON.stringify(credenciales),
            mode="cors",
            headers:{
                'Content-Type':'application/json'
            }
        }
    )

    const token = await resposta.json();

    return token;

}



export default{

    getAll: async ()=>{

        const token = await getToken();

        const res = await fetch(DOCS_URL, 
            {
                method="GET",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': "Bearer " + token.access
                }
            }
        )

        const items = await res.json();
        console.log(items)
        return items.results;
    },


    insert: async (doc)=>{

        const token = await getToken();

        const res = await fetch(DOCS_URL, 
            {
                method="POST",
                body=JSON.stringify(doc),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': "Bearer " + token.access
                }
            }
        )

        if(!res.ok){
            return res.statusText;
        }

        const item = await res.json();
        return item;

    },


    update: async (doc)=>{

        const token = await getToken();
        let url = DOCS_URL + doc.id + "/";

        const res = await fetch(url, 
            {
                method="PUT",
                body=JSON.stringify(doc),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': "Bearer " + token.access
                }
            }
        )

        if(!res.ok){
            return res.statusText;
        }

        const item = await res.json();
        return item;

    },
    deleteForId: (id)=>{

        const token = await getToken();
        let url = DOCS_URL + id + "/";

        fetch(url, 
            {
                method="DELETE",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': "Bearer " + token.access
                }
            }
        )
        .catch(error => console.log("Error: ", error));

    },
}