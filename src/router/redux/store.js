import { createStore, applyMiddleware } from 'redux'
import { fromJS } from 'immutable'
import reduxThunk from 'redux-thunk'

const reducer = (olstate = fromJS({
    location: 'http://192.168.150.129:9501',
    baotai:'/api',
    useroot:[],
    useroot_wen:[],
}), action) => {
    switch (action.type) {
        case 'useroot': return olstate.setIn(['useroot'], action.data)
        case 'useroot_wen': return olstate.setIn(['useroot_wen'], action.data)

        default: return olstate
    }
}

const store = createStore(reducer, applyMiddleware(reduxThunk))
export default store