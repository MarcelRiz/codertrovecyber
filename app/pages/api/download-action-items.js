// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import PdfBuilder from '../../src/utilities/pdf-builder'
import { ACTION_ITEM_STATE, ACTION_ITEM_TYPE } from '../../src/constants'

export default (req, res) => {
  try {
    const { items } = req.body
    const industryScore = req.body.industryScore || 0
    const companySecurity = req.body.companySecurity || 0

    const builder = new PdfBuilder()

    const pending = items.filter(
      item => item.state === ACTION_ITEM_STATE.UNRESOLVED
    ).length

    builder
      .addElement({
        text: [
          { text: 'Total Rating:', bold: true },
          ' ',
          `${companySecurity}%`,
        ],
      })
      .addElement({
        text: [
          { text: 'Industry Rating', bold: true },
          ' ',
          `${industryScore}%`,
        ],
      })
      .addElement({
        text: [{ text: 'Pending action items', bold: true }, ' ', pending],
      })

    if (items.length) {
      const table = {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', 80],
          body: [
            [
              'Action Item Name',
              'Detail',
              'Control',
              'Control Mapping',
              'Status',
            ],
          ],
        },
      }

      items.forEach(item => {
        const actionItem =
          item.type === ACTION_ITEM_TYPE.CUSTOM
            ? item.customActionItem
            : item.actionItem
        table.table.body.push([
          actionItem.actionItemSummary,
          actionItem.actionItemSummary,
          actionItem.securityDomain || '',
          actionItem.controlMapping || '',
          item.state === ACTION_ITEM_STATE.UNRESOLVED ? 'Pending' : 'Completed',
        ])
      })

      builder.addElement(table)
    } else {
      builder.addElement({
        text: 'No action items found.',
      })
    }

    builder
      .generate()
      .then(base64 => {
        // res.json({
        //   data: base64,
        // })
        res.setHeader('content-type', 'application/pdf')
        res.send(`data:application/pdf;base64,${base64}`)
      })
      .catch(error => {
        console.error(error)
        res.status(500).json({
          error: true,
          message: error.message,
        })
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}
