export var store = {
  debug: true,
  state: {
    templates: {}
  },
  setTemplateAction (templateId, template) {
    if (this.debug) console.log('setTemplateAction triggered with', template)
    this.state.templates[templateId] = template
    window.localStorage.setItem(templateId, JSON.stringify(template))
  },
  clearTemplateAction () {
    if (this.debug) console.log('clearTemplateAction triggered')
    this.state.templates = {}
  }
}
