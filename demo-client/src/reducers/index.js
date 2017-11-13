import { meta } from "./metadata-reducer.js"
import { combineReducers } from "redux"

const rootReducer = combineReducers({
  meta,
})

export default rootReducer
