<template>
  <div>
    <form @submit.prevent="submit" class="conn-form">
      <div class="conn-form__block">
        <label for="">Name</label>
        <input type="text" class="conn-form__input" v-model="connectionForm.name">
      </div>
      <div class="conn-form__block">
        <label for="">Host</label>
        <input type="text" class="conn-form__input" v-model="connectionForm.host">
      </div>
      <div class="conn-form__block">
        <label for="" class="">User</label>
        <input type="text" class="conn-form__input" v-model="connectionForm.user">
      </div>
      <div class="conn-form__block">
        <label for="">Pass</label>
        <input type="password" class="conn-form__input" v-model="connectionForm.password">
      </div>
      <div class="conn-form__block">
        <label for="">Database</label>
        <input type="text" class="conn-form__input" v-model="connectionForm.database">
      </div>
      <div class="conn-form__block">
        <input type="submit" class="conn-form__btn" @click.prevent="submit" value="Start Connection">
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      connectionForm: {
        name: 'My First Connection',
        host: '127.0.0.1',
        user: 'root',
        password: null,
        database: 'privex_frontend'
      }
    }
  },
  props: ['uid'],
  methods: {
    ...mapActions('tabs', ['createConnection']),
    async submit () {
      try {
        const connection = await this.createConnection({
          uid: this.uid,
          ...this.connectionForm,
        })
        this.$emit('connected', connection)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
.conn-form {
  border-radius: .5rem;
  background: #efefef;
  align-self: center;
  padding: 2rem;
  min-width: 300px;
  border: 1px solid #d6d6d6;
  box-shadow: 0 0 11px -10px black;
}
.conn-form__block {
  margin: 0.75rem 0;
}
.conn-form__block > label {
  display: block;
  text-align: left;
  padding-left: 0.2rem;
}
.conn-form__input {
  outline: none;
  width: 100%;
  padding: 0.3rem;
}
.conn-form__btn {
  margin: 2rem 0;
  width: 100%;
  border: 0;
  outline: none;
  padding: 1rem;
  border-radius: 0.3rem;
  box-shadow: 0 0 0.4rem -0.3rem black;
  background: rgb(234, 66, 175);
  color: white;
}

.conn-form__btn:hover {
  background: rgb(212, 57, 157);
}
.conn-form__btn:active {
  background: rgb(197, 44, 143);

}
</style>
