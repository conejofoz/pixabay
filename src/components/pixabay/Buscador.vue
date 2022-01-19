<template>
  <div>
    <b-row align-h="center">
      <b-col md="6">
        <b-form-input
          @keypress.enter="buscadorHijo"
          v-model="buscar"
          placeholder="Ingrese la busca"
        ></b-form-input>
      </b-col>
      <b-col md="1">
        <b-button variant="danger" @click="buscadorHijo">Buscar</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "Buscador",
  data() {
    return {
      buscar: "",
    };
  },
  methods: {
    buscadorHijo() {
      this.$emit("buscarDesdeHijo", this.buscar);
    },
  },
};
</script>


<style lang="stylus" scoped></style>