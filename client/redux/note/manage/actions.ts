import * as types from './types'
import { getNoteService, addNoteService, updateNoteService, deleteNoteService, searchNoteService, batchDeleteNoteService } from '../../../service/note/manage'

export const getNote = (page=0, pageSize=10) => (
  dispatch: (arg0: {
    type: string
    payload?: { note: any }
  }) => void
) => {
  dispatch({
    type: types.GET_NOTE
  })

  getNoteService(page, pageSize)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.GET_NOTE_SUCCEEDED,
        payload: {
          note: data.note
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.GET_NOTE_FAILED
      })
    })
}

export const searchNote = (page=0, pageSize=10, data: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { note: any }
  }) => void
) => {
  dispatch({
    type: types.SEARCH_NOTE
  })

  searchNoteService(page, pageSize, data)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.SEARCH_NOTE_SUCCEEDED,
        payload: {
          note: data.noteSearch
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.SEARCH_NOTE_FAILED
      })
    })
}

export const updateSSRNote = (note: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { note: any }
  }) => void
) => {
  dispatch({
    type: types.UPDATE_SSR_NOTE,
    payload: {
      note: note
    }
  })
}

export const addNote = (obj:any) => (
  dispatch: (arg0: {
    type: string
    payload?: { note: any }
  }) => void
) => {
  dispatch({
    type: types.ADD_NOTE
  })

  addNoteService(obj)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      const note = {
        id: data.noteAdd,
        ...obj
      }
      dispatch({
        type: types.ADD_NOTE_SUCCEEDED,
        payload: {
          note
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.ADD_NOTE_FAILED
      })
    })
}

export const modNote = (id: number, obj: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { note: any }
  }) => void
) => {
  dispatch({
    type: types.MOD_NOTE
  })

  updateNoteService(id, obj)
    .then((res: any) => {
      console.log('action_res', res)
      const note = {
        id,
        ...obj
      }
      dispatch({
        type: types.MOD_NOTE_SUCCEEDED,
        payload: {
          note
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.MOD_NOTE_FAILED
      })
    })
}

export const delNote = (id: number) => (
  dispatch: (arg0: {
    type: string
    payload?: { id: number }
  }) => void
) => {
  dispatch({
    type: types.DEL_NOTE
  })

  deleteNoteService(id)
    .then((res: any) => {
      console.log('action_res', res)

      dispatch({
        type: types.DEL_NOTE_SUCCEEDED,
        payload: {
          id
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.DEL_NOTE_FAILED
      })
    })
}

export const batchDelNote = (ids:any) => (
  dispatch: (arg0: {
    type: string
    payload?: { ids: any }
  }) => void
) => {
  dispatch({
    type: types.BATCH_DEL_NOTE
  })

  batchDeleteNoteService(ids)
    .then((res: any) => {
      console.log('action_res', res)

      dispatch({
        type: types.BATCH_DEL_NOTE_SUCCEEDED,
        payload: {
          ids
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.BATCH_DEL_NOTE_FAILED
      })
    })
}