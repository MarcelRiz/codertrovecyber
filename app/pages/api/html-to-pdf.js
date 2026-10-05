// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import PdfBuilder from '../../src/utilities/pdf-builder'

export default (req, res) => {
  try {
    const { html } = req.body
    const builder = new PdfBuilder()

    builder.setContentFromHTML(html)

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
