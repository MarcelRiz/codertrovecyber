import PdfPrinter from 'pdfmake'
import htmlToPdfMake from 'html-to-pdfmake'
import jsdom from 'jsdom'
import path from 'path'

const { JSDOM } = jsdom
const { window } = new JSDOM('')

// console.log('pdf-builder', path.resolve(__dirname))
// const env = process.env.NODE_ENV
const dir = process.env.PDFMAKE_FONT_PATH || '../../..'

const fonts = {
  Roboto: {
    // eslint-disable-next-line max-len
    normal: path.resolve(__dirname, dir, 'public/fonts/Roboto-Regular.ttf'),
    // eslint-disable-next-line max-len
    bold: path.resolve(__dirname, dir, 'public/fonts/Roboto-Medium.ttf'),
    // eslint-disable-next-line max-len
    italics: path.resolve(__dirname, dir, 'public/fonts/Roboto-Italic.ttf'),
    // eslint-disable-next-line max-len
    bolditalics: path.resolve(
      __dirname,
      dir,
      'public/fonts/Roboto-MediumItalic.ttf'
    ),
  },
}

export default class PdfBuilder {
  constructor() {
    this.content = []
  }

  setContentFromHTML(html) {
    const contentHtml = htmlToPdfMake(html, { window })
    this.content.push(contentHtml)
    return this
  }

  addElement(element) {
    this.content.push(element)
    return this
  }

  generate() {
    return new Promise((resolve, reject) => {
      const printer = new PdfPrinter(fonts)
      const docDefinition = {
        content: this.content,
        compress: false,
        defaultStyle: {
          fontSize: 12,
          lineHeight: 1.5,
        },
      }
      const options = {}

      const pdfDoc = printer.createPdfKitDocument(docDefinition, options)
      const chunks = []

      pdfDoc.on('data', chunk => {
        chunks.push(chunk)
      })
      pdfDoc.on('end', () => {
        const bufferData = Buffer.concat(chunks)
        resolve(bufferData.toString('base64'))
      })
      pdfDoc.on('error', error => {
        reject(error)
      })
      pdfDoc.end()
    })
  }
}
