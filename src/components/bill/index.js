const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const fs = require('fs-extra')
const path = require('path')

const db = {
    products: [
        {cuantity: 4, name: 'A', price: 15.25,},
        {cuantity: 5, name: 'B', price: 16.25,},
        {cuantity: 6, name: 'C', price: 17.25,},
    ]
}

router.post('/', async (req, res) => {

    try {

        const filePath = path.join(process.cwd(), 'src', 'templates', 'bill', 'index.hbs')
        const html = await fs.readFile(filePath, 'utf-8')
        const content = handlebars.compile(html)(db)

        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setContent(content)
        await page.pdf({
            path: 'pdfPrueba.pdf',
            format: 'A4',
            printBackground: true,
        })

        res.send('PDF CREADO')

    } catch (error) {
        console.error(error)
        throw error
    }

})

module.exports = router