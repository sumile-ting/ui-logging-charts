import {get} from '../util/request'

const url = '/graphics/templates'

export const getTemplateDetail = (templateId) =>  {get(url + '/' + templateId)}
