import {get, post} from '../util/request'


export const getWellStartEnd = (wellname, xcType) =>  {
  const url = '/well-commons/start-end/';
  return get(`${url}` + `${encodeURIComponent(wellname)}`, {xcType: xcType})
}

export const getwellbore = (param1, params) => {
 const url = '/well-bore';
 return post(url, param1, {params: params})
}
