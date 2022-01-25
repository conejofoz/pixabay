<template>
    <div>
        
    </div>
</template>


<script>
import moment from 'moment'
export default {
    name:"Item",
    components:{

    },
    props:["item", "items"],
    data() {
        return {
            
        }
    },
    methods: {
        borrarDocumento(){
            let id = this.item.id;
            try {
                this.$store.commit("mostrarLoading", "Cargando Item");
                this.$store.commit("borrarDoc", {"id": id});
            } catch (error) {
                console.error(error);
            } finally {
                this.$store.commit("ocultarLoading");
            }
        },
        expirado(fecha){
            return Date.parse(fecha) <= Date.now() ? true : false;
        },
        faltan(fecha){
            const vence = moment(fecha);
            const hoy = moment(Date.now());
            const annios = vence.diff(hoy, "year");
            const meses = vence.diff(hoy, "months");
            const dias = vence.diff(hoy, "days");
            const rs = annios + " años " + meses + " meses " + dias + " dias ";
            return this.expirado(fecha) + rs.replace(/-/g, "") : "Faltan : " + rs;

        }
    },
    computed:{

    }
}
</script>


<style lang="stylus">

</style>
