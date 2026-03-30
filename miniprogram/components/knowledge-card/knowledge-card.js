Component({
  properties: {
    card: { type: Object, value: {} }
  },
  methods: {
    onNext() {
      this.triggerEvent('onNext')
    }
  }
})
