import { combineReducers } from 'redux'
import applications from './applications'
import account from './account'

export default combineReducers({
  applications,
  account
})