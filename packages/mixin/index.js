import '../util/common'
import {mmToPX, pxToMM} from "../util/common";
export default {
  methods: {
    mmToPX(val) {
      return mmToPX(val)
    },
    pxToMM(val) {
      return pxToMM(val)
    },
    lineStyleTansfer(val) {
      const LINE_STYLE_MAP = {
                Solid: 'solid',
                Dot: 'dotted',
                Dash: 'dashed'
            };
      return LINE_STYLE_MAP[val] || 'solid'
    }
  }
}
