import * as types from "./action-types"

export const storeDoi = doi => ({
  type: types.STORE_DOI,
  doi,
})

export const storeUrl = pdfUrl => ({
  type: types.STORE_URL,
  pdfUrl,
})

export const doiFetchOK = meta => ({
  type: types.DOI_FETCH_OK,
  meta,
})

export const changeMeta = meta => ({
  type: types.CHANGE_META,
  meta,
})

export const clearMeta = () => ({
  type: types.CLEAR_META,
})
