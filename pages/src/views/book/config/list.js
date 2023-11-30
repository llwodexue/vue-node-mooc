import { parseTime } from '@/utils'
const valueFilter = value => value || '无'
const timeFilter = time => (time ? parseTime(time) : '无')

const columns = [
  {
    field: 'id',
    label: 'ID',
    visible: true,
    width: 80,
    itemAttr: {
      sortable: 'custom'
    }
  },
  {
    field: 'titleWrapper',
    label: '书名',
    visible: true,
    width: 150,
    type: 'slot'
  },
  {
    field: 'authorWrapper',
    label: '作者',
    visible: true,
    width: 150,
    type: 'slot'
  },
  {
    field: 'publisher',
    label: '出版社',
    visible: true,
    width: 150
  },
  {
    field: 'categoryText',
    label: '分类',
    visible: true,
    width: 100
  },
  {
    field: 'language',
    label: '语言',
    visible: true,
    width: 100
  },
  {
    field: 'cover',
    label: '封面',
    visible: false,
    width: 120,
    type: 'slot'
  },
  {
    field: 'fileName',
    label: '文件名',
    visible: true,
    width: 150
  },
  {
    field: 'filePath',
    label: '文件路径',
    visible: true,
    width: 120,
    format: valueFilter
  },
  {
    field: 'coverPath',
    label: '封面路径',
    visible: true,
    width: 120,
    format: valueFilter
  },
  {
    field: 'unzipPath',
    label: '解压路径',
    visible: true,
    width: 120,
    format: valueFilter
  },
  {
    field: 'createUser',
    label: '上传人',
    visible: true,
    width: 100,
    format: valueFilter
  },
  {
    field: 'createDt',
    label: '上传时间',
    visible: true,
    width: 140,
    format: timeFilter
  },
  {
    field: 'operator',
    label: '操作',
    visible: true,
    minWidth: 180,
    type: 'slot',
    itemAttr: { fixed: 'right' }
  }
]

export { columns }
