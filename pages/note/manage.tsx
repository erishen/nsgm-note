import React, { useEffect, useState } from 'react'
import { ConfigProvider, Table, Modal, Button, Input, Space, Upload, message } from 'antd'
import { Container, SearchRow, ModalContainer } from '../../client/styled/note/manage'
import { useDispatch, useSelector } from 'react-redux'
import { getNote, addNote, modNote, delNote, updateSSRNote, searchNote, batchDelNote } from '../../client/redux/note/manage/actions'
import { getNoteService } from '../../client/service/note/manage'
import { RootState } from '../../client/redux/store'
import _ from 'lodash'
import moment from 'moment'
import locale from 'antd/lib/locale/zh_CN'
import { handleXSS, checkModalObj } from '../../client/utils/common'
import { utils, writeFile } from 'xlsx'
import { UploadOutlined } from '@ant-design/icons'

const pageSize = 100
const dateFormat = 'YYYY-MM-DD'
const currentDate = moment().format(dateFormat)
console.log('currentDate', currentDate)

const keyTitles = {
  name: '名称'
}

const Page = ({ note }) => { 
  const dispatch = useDispatch()
  const [isModalVisiable, setIsModalVisible] = useState(false)
  const [modalId, setModalId] = useState(0)
  const [modalName, setModalName] = useState('')
  const [searchName, setSearchName] = useState('')
  const [batchDelIds, setBatchDelIds] = useState([])

  useEffect(() => {
    dispatch(updateSSRNote(note))
  }, [dispatch])

  const state = useSelector((state: RootState) => state)
  const { noteManage }:any = state
  console.log('noteManage', noteManage)

  if (!noteManage.firstLoadFlag) { 
    note = noteManage.note
  }
  
  const { totalCounts, items:noteItems } = _.cloneDeep(note)
  console.log('note', note)

  _.each(noteItems, (item, index) => { 
    const { id } = item
    item.key = id
  })

  const dataSource = noteItems
  const columns:any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false
    },
    {
      title: keyTitles.name,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false
    },
    {
      title: '操作',
      dataIndex: '',
      render: (_:any, record:any) => {
        return (
          <Space>
            <Button onClick={() => { 
              console.log('record', record)
              updateNote(record)
            }}>修改</Button>
            <Button onClick={() => { 
              console.log('record', record)
              const { id } = record
              deleteNote(id)
            }}>删除</Button>
          </Space>
        )
      }
    }
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setBatchDelIds(selectedRowKeys)
    }
  }

  const createNote = () => {
    setModalId(0)
    setModalName('')
    showModal()
  }

  const updateNote = (record:any) => { 
    let { id, name } = record

    setModalId(id)
    setModalName(name)
    showModal()
  }

  const deleteNote = (id:number) => { 
    Modal.confirm({
      title: '提示',
      content: '确认删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk : (e) => {
        dispatch(delNote(id))
        Modal.destroyAll()
      }
    })
  }

  const showModal = () => { 
    setIsModalVisible(true)
  }

  const getMessageTitle = (key: string) => { 
    let result = keyTitles[key]
    if (result == undefined)
      result = key
    return result
  }

  const handleOk = () => { 
    const modalObj = {
      name: handleXSS(modalName)
    }
    console.log('handleOk', modalObj)

    const checkResult = checkModalObj(modalObj)

    if (!checkResult) {
      if (modalId == 0) {  // 新增
        dispatch(addNote(modalObj))
      } else {
        dispatch(modNote(modalId, modalObj))
      }
      
      setIsModalVisible(false)
    } else { 
      message.info(getMessageTitle(checkResult.key) + checkResult.reason)
    }
  }

  const handleCancel = () => { 
    setIsModalVisible(false)
  }

  const doSearch = () => { 
    dispatch(searchNote(0, pageSize, { name: handleXSS(searchName) }))
  }

  const exportNote = () => { 
    if (noteItems.length > 0) {
      const wb = utils.book_new()
      const jsonData = _.map(noteItems, (item) => _.omit(item, ['key']))
      //console.log('jsonData', jsonData)
      const ws = utils.json_to_sheet(jsonData)
  
      /* add worksheet to workbook */
      utils.book_append_sheet(wb, ws, "Note")
  
      /* write workbook */
      writeFile(wb, "Note.xlsx")
    } else { 
      message.info("没有数据无需导出")
    }
  }

  const uploadProps = {
    name: 'file',
    action: '/rest/note/import',
    onChange(info:any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }

      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
        window.location.reload()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    }
  }

  const batchDeleteNote = () => { 
    if (batchDelIds.length > 0) { 
      Modal.confirm({
        title: '提示',
        content: '确认批量删除吗',
        okText: '确认',
        cancelText: '取消',
        onOk : (e) => {
          dispatch(batchDelNote(batchDelIds))
          Modal.destroyAll()
        }
      })
    } else { 
      message.info("没有数据不能批量删除")
    }
  }

  return (  
    <Container>
      <ConfigProvider locale={locale}>
        <SearchRow>
          <Space>
            <Button type="primary" onClick={createNote}>
              新增
            </Button>
            <Input value={searchName} placeholder="" onChange={(e) => setSearchName(e.target.value)} />
            <Button type="primary" onClick={doSearch}>
              搜索
            </Button>
            <Button type="primary" onClick={exportNote}>
              导出
            </Button>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined rev={undefined} />}>导入</Button>
            </Upload>
            <Button type="primary" onClick={batchDeleteNote}>
              批量删除
            </Button>
          </Space>
        </SearchRow>
        <Table rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}  dataSource={dataSource} columns={columns} pagination={{
              total: totalCounts,
              pageSize: pageSize,
              onChange: (page, pageSize) => { 
                console.log('onChange', page, pageSize)
                dispatch(searchNote(page - 1, pageSize, { name: handleXSS(searchName) }))
              }
        }} />
        <Modal title={(modalId == 0 ? "新增" : "修改") + " note"} open={isModalVisiable} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
          <ModalContainer>
            <div className="line">
              <label>{keyTitles.name}</label>
              <Input value={modalName} placeholder="" onChange={(e) => setModalName(e.target.value)} />
            </div>
          </ModalContainer>
        </Modal>
      </ConfigProvider>
    </Container>
  )
}

Page.getInitialProps = async () => {
  let note = null

  await getNoteService(0, pageSize).then((res: any) => { 
    console.log('res', res)
    const { data } = res
    note = data.note
  })

  console.log('note-getInitialProps', note)

  return {
    note
  }
}

export default Page