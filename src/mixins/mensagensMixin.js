/* 
mixin local para ser importado em cada componente
O mixin global é definido no main.js
 */
export default{
    methods: {
        mensagem(mensagem, titulo="", tipo="success"){
            this.$swal({
                title: titulo,
                text: mensagem,
                icon: tipo,
                allowOutsideClick:false,
                confirmButtonText: 'Ok',
            })
        },
        async mensagemPergunta(mensagem, titulo, tipo="question"){
            try {
                let result = await this.$swal({
                    title: titulo,
                    text: mensagem,
                    icon: tipo,
                    showCancelButton:true,
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Não',
                    reverseButtons:true
                })
                return result.isConfirmed;
            } catch (error) {
                console.log(error)
            }
        }
    },
}