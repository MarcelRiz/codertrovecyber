import React from 'react'

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config)
  
  const sortedItems = React.useMemo(() => {
    const sortableItems = [...items]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valueA = a[sortConfig.key] || ''
        const valueB = b[sortConfig.key] || ''
        if (valueA < valueB) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [items, sortConfig])

  const requestSort = key => {
    let direction = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return { items: sortedItems, requestSort, sortConfig }
}

export default useSortableData