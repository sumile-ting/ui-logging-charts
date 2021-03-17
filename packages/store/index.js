export default {
  state: {
     templates: {}
  },
  mutations: {
    SET_TEMPLATE: (state, {templateId, template}) =>  {
      state.templates[templateId] = template
      window.localStorage.setItem(templateId, JSON.stringify(template))
    },
    CLEAR_TEMPLATE (state) {
      state.templates = {}
    }
  },
  actions: {
    setTemplateAction({commit}, { templateId, template }) {
      commit('SET_TEMPLATE', {templateId, template})
    },
    clearTemplateAction({commit}) {
      commit('CLEAR_TEMPLATE')
    }
  }
}
