<template>
  <div class="mnemonic-tags">
    <div class="mnemonic-tags-item"
      v-for="(tag, $index) in mnemonics"
      :key="$index"
      :class="{
        active: isActive($index)
      }"
      @click="handleClick($index)">
      {{ tag }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mnemonic-tags',

    props: {
      mnemonics: {
        type: Array,
        default: []
      },

      defaultSelection: {
        type: Array // mnemonic word
      }
    },

    created () {
      const { mnemonics, defaultSelection, selection } = this

      if (mnemonics && defaultSelection) {
        const mnemonicsCloned = mnemonics.slice()
        defaultSelection.forEach((item) => {
          const index = mnemonicsCloned.indexOf(item)
          if (index !== -1) {
            selection.push(index)
            mnemonicsCloned[index] = null
          }
        })
      }
    },

    methods: {
      handleClick (tagIndex) {
        const selection = this.selection
        const index = selection.indexOf(tagIndex)
        if (index === -1) {
          selection.push(tagIndex)
        } else {
          selection.splice(index, 1)
        }

        this.$emit('input', selection.map((index) => {
          return this.mnemonics[index]
        }))
      },

      isActive (tagIndex) {
        return this.selection.indexOf(tagIndex) !== -1
      }
    },

    data () {
      return {
        selection: []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mnemonic-tags {
  }

  .mnemonic-tags-item {
    display: inline-block;
    background-color: rgba(0, 61, 184, 0.05);
    color: #003db8;
    font-size: 16px;
    border-radius: 4px;
    padding: 6px 16px;
    margin-right: 16px;
    margin-bottom: 10px;
    cursor: pointer;

    &.active {
      background-color: #3c78ea;
      color: #fff;
    }
  }
</style>
