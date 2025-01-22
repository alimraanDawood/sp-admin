<template>
    <input class="bg-transparent text-right w-full text-black/50 font-medium focus:outline-none"
      ref="inputRef"
      type="text"
    />
  </template>
  
  <script>
  import { useCurrencyInput } from 'vue-currency-input'
  
  export default {
    name: 'CurrencyInput',
    props: {
      modelValue: Number, // Vue 2: value
      options: Object
    },
    setup(props) {
      const { inputRef } = useCurrencyInput(props.options)
  
      return { inputRef }
    }
  }
  </script>