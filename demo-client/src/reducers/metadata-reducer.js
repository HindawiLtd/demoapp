import * as types from "../actions/action-types"
import { merge } from "lodash"

const initialState = {
  doi: "",
  pdfUrl: "",
  meta: {
    message: {
      abstract: "",
      author: [],
      language: "",
      link: [],
      publisher: "",
      "published-print": {
        "date-parts": [],
      },
      title: "",
      type: "",
    },
  },
}

export const meta = (state = initialState, action) => {
  switch (action.type) {
    case types.CLEAR_META:
      return { ...initialState }
    case types.STORE_DOI:
      return { ...state, doi: action.doi }
    case types.STORE_URL:
      return { ...state, pdfUrl: action.pdfUrl }
    case types.DOI_FETCH_OK:
      return { ...state, meta: action.meta }
    case types.CHANGE_META:
      return merge({}, state, { meta: action.meta })
    default:
      return state
  }
}
