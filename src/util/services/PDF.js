const path = require('path')
const moment = require('moment')
const fs = require('fs-extra')
const hb = require('handlebars')
const puppeteer = require('puppeteer')
const config = require('../../config')

exports.createPDF = async (context, userId, templateName) => {

    hb.registerHelper('dateFormat', (value, formater) => {
        return moment(value).format(formater)
    })

    try {
        const urlReports = path.join('reports', userId)
        const dirExists = await fs.exists(path.join(process.cwd(), 'public', urlReports))
        console.log(dirExists)
        if (!dirExists) {
            await fs.mkdir(path.join(process.cwd(), 'public', urlReports), {recursive: true})
        }
        const pathTemplate = path.join(process.cwd(), 'src', 'templates', templateName)
        const html = await fs.readFile(pathTemplate, 'utf-8')
        const content = hb.compile(html)(context)
        const pdfName = `${parseInt(Date.now())}-${context.no_bill}.pdf`
        const pdfRouteName = `${path.join(process.cwd(), 'public', urlReports)}/${pdfName}`


        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setContent(content)
        await page.pdf({
            path: pdfRouteName,
            format: 'A4',
            printBackground: true
        })
        await browser.close()
        return `http://${config.APP_HOST}:${config.APP_PORT}/${urlReports}/${pdfName}`
    } catch (error) {
        console.error(error)
        throw error
    }

}