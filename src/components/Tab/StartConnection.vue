<template>
  <div>
    <ul>
      <li v-for="(fav, index) in state.favourites" :key="index">{{ fav.name }}</li>
    </ul>
    <form class="conn-form" @submit.prevent="submit">
      <div class="conn-form__block">
        <label for="">Name</label>
        <input
          v-model="state.connectionForm.name"
          type="text"
          class="conn-form__input"
        >
      </div>
      <div class="conn-form__block">
        <label for="">Host</label>
        <input
          v-model="state.connectionForm.host"
          type="text"
          class="conn-form__input"
        >
      </div>
      <div class="conn-form__block">
        <label for="" class="">User</label>
        <input
          v-model="state.connectionForm.user"
          type="text"
          class="conn-form__input"
        >
      </div>
      <div class="conn-form__block">
        <label for="">Pass</label>
        <input
          v-model="state.connectionForm.password"
          type="password"
          class="conn-form__input"
        >
      </div>
      <div class="conn-form__block">
        <label for="">Database</label>
        <input
          v-model="state.connectionForm.database"
          type="text"
          class="conn-form__input"
        >
      </div>
      <div class="conn-form__block">
        <input
          type="submit"
          class="conn-form__btn"
          value="Start Connection"
          @click.prevent="submit"
        >
      </div>
    </form>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import * as v from '@vue/composition-api'
import store from '@/store'

export default v.defineComponent({
  setup (props, { root }) {
    const state = v.reactive({
      connectionForm: {
        name:     'My First Connection',
        host:     '127.0.0.1',
        user:     'root',
        password: null,
        database: 'privex_frontend',
      },
      uid:        v.computed(() => store.state.tabs.selectedTabUid),
      favourites: v.computed(() => store.state.favourites.list),
    })

    const submit = () => {
      store.dispatch.tabs.createConnection({
        uid:    state.uid,
        config: state.connectionForm,
      })
    }
    
    return {
      state,
      submit,
    }
  },
})
</script>

<style>
.conn-form {
  border-radius: 0.5rem;
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
