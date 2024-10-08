const express = require('express')
const XLSX = require('xlsx')
const { noteBatchAdd } = require('../modules/note/resolver')
const router = express.Router()

router.post('/import', (req, res) => {
    //console.log('files', req.files)
    const workbook = XLSX.read(req.files.file.data, { type: "buffer" })
    //console.log('Sheets', workbook.Sheets)

    const datas = XLSX.utils.sheet_to_json(workbook.Sheets["Note"])
    //console.log('datas', datas)

    noteBatchAdd({ datas })
    res.json({ name: 'Note' })
})

module.exports = router