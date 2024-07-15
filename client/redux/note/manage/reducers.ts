import * as types from './types'
import _ from 'lodash'

const initialState = {
  firstLoadFlag: true,
  note: {
    totalCounts: 0,
    items: []
  }
}

export const noteManageReducer = (state = initialState, { type, payload }) => {
  const { note } = state
  const { totalCounts, items } = note
  let newItems:any = []

  switch (type) {
    case types.UPDATE_SSR_NOTE:
      //console.log('reducer_payload_ssr', payload)
      return {
        ...state,
        firstLoadFlag: true,
        note: payload.note
      }
    case types.GET_NOTE_SUCCEEDED:
      //console.log('reducer_payload_get', payload)
      return {
        ...state,
        firstLoadFlag: false,
        note: payload.note
      }
    case types.SEARCH_NOTE_SUCCEEDED:
      console.log('reducer_payload_search', payload)
      return {
        ...state,
        firstLoadFlag: false,
        note: payload.note
      }
    case types.ADD_NOTE_SUCCEEDED:
      //console.log('reducer_payload_add', payload)
      newItems = [...items]
      newItems.push(payload.note)

      //console.log('newItems-add', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        note: {
          totalCounts: totalCounts + 1,
          items: newItems
        }
      }
    case types.MOD_NOTE_SUCCEEDED:
      //console.log('reducer_payload_mod', payload)
      const modItem = payload.note

      _.each(items, (item:any, index) => { 
        if (item.id == modItem.id) {
          newItems.push(modItem)
        } else { 
          newItems.push(item)
        }
      })

      //console.log('newItems-mod', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        note: {
          totalCounts: totalCounts,
          items: newItems
        }
      }
    case types.DEL_NOTE_SUCCEEDED:
      //console.log('reducer_payload_del', payload)
      const delItemId = payload.id

      _.each(items, (item:any, index) => { 
        if (item.id != delItemId) { 
          newItems.push(item)
        }
      })

      //console.log('newItems-del', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        note: {
          totalCounts: totalCounts - 1,
          items: newItems
        }
      }
    case types.BATCH_DEL_NOTE_SUCCEEDED:
      const delItemIds = payload.ids
      const allIds = _.map(_.map(items, (item) => _.pick(item, ['id'])), 'id')
      const diffIds = _.xor(allIds, delItemIds)

      console.log('delItemIds', delItemIds, allIds, diffIds)

      newItems = _.filter(items, (item:any) => _.includes(diffIds, item.id))

      let newTotalCounts = totalCounts - delItemIds.length
      if (newTotalCounts < 0)
        newTotalCounts = 0
      
      console.log('newItems-batch-del', newItems, newTotalCounts)
      return {
        ...state,
        firstLoadFlag: false,
        note: {
          totalCounts: newTotalCounts,
          items: newItems
        }
      }
    default:
      return state
  }
}