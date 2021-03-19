import {scaleLinear, scaleSequential} from 'd3-scale'
import {interpolateRainbow} from 'd3-scale-chromatic'
const d3 = {scaleLinear, scaleSequential, interpolateRainbow}

/**
 * 像素转毫米
 */
export function pxToMM(val) {
    const cmpxDom = document.createElement('div');
    cmpxDom.style.visibility = 'hidden';
    cmpxDom.style.height = '1cm';
    cmpxDom.setAttribute('id', 'cmpx');
    const body = document.querySelector('body');
    body.appendChild(cmpxDom);

    let px = cmpxDom.offsetHeight; //1厘米对应得像素值
    body.removeChild(cmpxDom);
    return parseFloat(Number(val / px * 10).toFixed(2));
}

/**
 * 毫米转像素
 */
export function mmToPX(val) {
    const cmpxDom = document.createElement('div');
    cmpxDom.style.visibility = 'hidden';
    cmpxDom.style.height = '1cm';
    cmpxDom.setAttribute('id', 'cmpx');
    const body = document.querySelector('body');
    body.appendChild(cmpxDom);

    let px = cmpxDom.offsetHeight; //1厘米对应得像素值
    body.removeChild(cmpxDom);
    return parseFloat(Number(val / 10 * px).toFixed(2));
}

/**
 * 获得字符串的可视宽度
 * @param fontSize
 * @param fontFamily
 * @returns {number}
 */
String.prototype.visualLength = function (fontSize = '12px', fontFamily = 'SimSun') {
    let span = document.createElement("span");
    span.innerHTML = `${this}`;
    span.style.fontSize = fontSize;
    span.style.fontFamily = fontFamily;
    document.body.appendChild(span);
    let size = span.offsetWidth;
    span.remove();
    return size;
}

/**
 * 获取线性比例尺
 * @param domainMin
 * @param domainMax
 * @param rangeMin
 * @param rangeMax
 * @returns {*}
 */
export function  getLineScale(domainMin, domainMax, rangeMin, rangeMax) {
  return d3.scaleLinear().domain([domainMin, domainMax]).range([rangeMin, rangeMax])

}

/**
 * 获取色标比例尺
 * @param domainMin
 * @param domainMax
 */
export function getColorLineScale(domainMin, domainMax) {
  return d3.scaleSequential().domain([domainMin, domainMax]).interpolator(d3.interpolateRainbow);
}

/**
 * 深拷贝
 * @param obj
 * @returns {boolean}
 */
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
export const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date)
  return new Date(obj)       // 日期对象直接返回一个新的日期对象
  if (obj.constructor === RegExp)
  return new RegExp(obj)     //正则对象直接返回一个新的正则对象
  //如果循环引用了就用 weakMap 来解决
  if (hash.has(obj)) return hash.get(obj)
  let allDesc = Object.getOwnPropertyDescriptors(obj)
  //遍历传入参数所有键的特性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
  //继承原型链
  hash.set(obj, cloneObj)
  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
  }
  return cloneObj
}
