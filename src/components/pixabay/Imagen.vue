<template>
    <div>

        <b-img :id="img.id" :src="img.previewURL" 
            thumbnail fluid rounded
            v-b-popover.hover.top="img.tags" title="Popover Title"
            @click="mostrarModal=true"
        >
        </b-img>
        <!-- @click="showModal" antes quando o modal estava no mesm arquivo -->



        <!-- <b-modal :ref="img.id" hide-footer size="xl" :title="img.tags">
            <div class="d-block text-center">
                <b-img-lazy top :id="img.id" :src="img.largeImageURL" :alt="img.tags" fluid rounded v-b-popover.focus="img.tags"></b-img-lazy>
            </div>
        </b-modal>  -->   

        <Modal :mostrarModal="mostrarModal" :img="img"></Modal>



    </div>
</template>

<script>

import Modal from './Modal.vue'

export default {
    name:"Imagen",
    props:["img"],
    components:{
        Modal,
    },
    mounted() {
        this.$root.$on('bv::modal::hide',()=>{
            this.mostrarModal = false
        })
    },
    data() {
        return {
            mostrarModal:false,
        }
    },
    methods: {
        showModal(){
            this.$refs[this.img.id].show();
        }
    },
}
</script>

<style lang="stylus" scoped>
    
</style>
