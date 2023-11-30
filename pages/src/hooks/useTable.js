import { ref, computed } from 'vue'

/**
 * @description 表格多选数据操作
 * @param mainKey 唯一标识，默认为 mainId
 */
export default function useTable({ mainKey = 'mainId', tableRef = ref(null), handleUpdate }) {
  const isSelected = ref(false)
  const single = ref(true)
  const multiple = ref(true)
  const selectedList = ref([])

  const idsList = computed(() => {
    const ids = []
    selectedList.value.forEach(item => {
      if (typeof mainKey === 'string') {
        ids.push(item[mainKey])
      } else {
        const obj = {}
        for (const key in mainKey) {
          obj[key] = item[mainKey[key]]
        }
        ids.push(obj)
      }
    })
    return ids
  })

  const selectionChange = selection => {
    isSelected.value = !!selection.length
    single.value = selection.length !== 1
    multiple.value = !selection.length
    selectedList.value = selection
  }

  const rowDblclick = row => {
    tableRef.value.clearSelection()
    tableRef.value.toggleRowSelection(row)
    handleUpdate && typeof handleUpdate === 'function' && handleUpdate()
  }

  return {
    isSelected,
    selectedList,
    idsList,
    selectionChange,
    single,
    multiple,
    rowDblclick
  }
}
