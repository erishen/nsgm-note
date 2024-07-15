import { BookOutlined, SolutionOutlined } from '@ant-design/icons'
import React from 'react'

let key = 1

export default [
  {
    key: key.toString(),
    text: '介绍',
    url: '/',
    icon: <BookOutlined rev={undefined} />,
    subMenus: null
  },
  {
    // note_manage_start
    key: (++key).toString(),
    text: 'note',
    url: '/note/manage',
    icon: <SolutionOutlined rev={undefined} />,
    subMenus: [
      {
        key: key + '_1',
        text: 'manage',
        url: '/note/manage'
      }
    ]
    // note_manage_end
  },
  /*{
    key: (++key).toString(),
    text: '模板',
    url: '/template/manage',
    icon: <SolutionOutlined rev={undefined} />,
    subMenus: [
      {
        key: key + '_1',
        text: '模板1',
        url: '/template/manage'
      }
    ]
  },*/
]
