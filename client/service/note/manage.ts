import { getLocalGraphql } from '../../utils/fetch'
import _ from 'lodash'

export const getNoteService = (page=0, pageSize=10) => {
  const getNoteQuery = `query ($page: Int, $pageSize: Int) { note(page: $page, pageSize: $pageSize) { 
        totalCounts items { 
          id name
        } 
      } 
    }`

    return getLocalGraphql(getNoteQuery, {
      page,
      pageSize
    })
}

export const searchNoteByIdService = (id: number) => {

  const searchNoteByIdQuery = `query ($id: Int) { noteGet(id: $id){
      id name
    }
  }`

  return getLocalGraphql(searchNoteByIdQuery, {
    id
  })
}

export const searchNoteService = (page = 0, pageSize = 10, data: any) => {
  const { name } = data

  const searchNoteQuery = `query ($page: Int, $pageSize: Int, $data: NoteSearchInput) { 
    noteSearch(page: $page, pageSize: $pageSize, data: $data) {
      totalCounts items { 
        id name
      } 
    }
  }`

  return getLocalGraphql(searchNoteQuery, {
    page, 
    pageSize,
    data: {
      name
    }
  })
}

export const addNoteService = (data: any) => { 
  const { name } = data

  const addNoteQuery = `mutation ($data: NoteAddInput) { noteAdd(data: $data) }`

  return getLocalGraphql(addNoteQuery, {
    data: {
      name
    }
  })
}

export const updateNoteService = (id: number, data: any) => { 
  const { name } = data

  const updateNoteQuery = `mutation ($id: Int, $data: NoteAddInput) { noteUpdate(id: $id, data: $data) }`

  return getLocalGraphql(updateNoteQuery, {
    id,
    data: {
      name
    }
  })
}

export const deleteNoteService = (id: number) => { 
  const deleteNoteQuery = `mutation ($id: Int) { noteDelete(id: $id) }`

  return getLocalGraphql(deleteNoteQuery, {
    id
  })
}

export const batchAddNoteService = (datas: any) => {
  const batchAddNoteQuery = `mutation ($datas: [NoteAddInput]) { noteBatchAdd(datas: $datas) }`

  return getLocalGraphql(batchAddNoteQuery, {
    datas
  })
}

export const batchDeleteNoteService = (ids: any) => { 
  const batchDeleteNoteQuery = `mutation ($ids: [Int]) { noteBatchDelete(ids: $ids) }`

  return getLocalGraphql(batchDeleteNoteQuery, {
    ids
  })
}