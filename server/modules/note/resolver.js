const { getConnection } = require('../../utils/common')
const _ = require('lodash')

module.exports = {
    note: ({ page = 0, pageSize = 10 }) => {
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const sql = 'SELECT id, name from note LIMIT ? OFFSET ?'
                const countSql = 'SELECT count(*) as counts from note'
                const values = [pageSize, page * pageSize]

                console.log('sql', sql, values, countSql)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)
                    
                    connection.query(countSql, (countError, countResults, countFields) => {
                        if (countError) throw countError
                        const totalCounts = countResults[0].counts
                        console.log('totalCounts', totalCounts)

                        resolve({
                            totalCounts,
                            items: results
                        })
                        connection.end()
                    })
                })
            })
        })
    }, 
    noteGet: ({ id }) => {
        console.log('noteGet', id)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'SELECT id, name from note WHERE 1=1'
                let values = []

                if(id !== undefined){
                    sql += ' AND id=? '
                    values.push(id)
                } 

                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    if(results.length > 0)
                        resolve(results[0])
                    else
                        reject()
                    connection.end()
                })
            })
        })
    },
    noteSearch: ({ page = 0, pageSize = 10, data }) => {
        console.log('noteSearch', page, pageSize, data)
        const { name } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const values = []
                const countsValues = []

                let whereSql = ''
                if(name !== undefined && name !== ''){
                    whereSql += ' AND name like ? '
                    values.push('%' + name + '%')
                    countsValues.push('%' + name + '%')
                }

                const sql = 'SELECT id, name from note WHERE 1=1 ' + whereSql + ' LIMIT ? OFFSET ?'
                const countSql = 'SELECT count(*) as counts from note WHERE 1=1 ' + whereSql

                values.push(pageSize)
                values.push(page * pageSize)
                
                console.log('sql', sql, values, countSql)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)
                    
                    connection.query(countSql, countsValues, (countError, countResults, countFields) => {
                        if (countError) throw countError
                        const totalCounts = countResults[0].counts
                        console.log('totalCounts', totalCounts)

                        resolve({
                            totalCounts,
                            items: results
                        })
                        connection.end()
                    })
                })
            })
        })
    }, 
    noteAdd: ({ data }) => {
        console.log('noteAdd', data)
        const { name } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{

                let sql = 'INSERT INTO note (name) values (?)'
                let values = [name]
                
                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(results.insertId)
                    connection.end()
                })
            })
        })
    },
    noteBatchAdd: ({ datas }) => {
        console.log('noteBatchAdd', datas)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{

                let sql = 'INSERT INTO note (name) values '
                let values = []

                _.each(datas, (item, index)=>{
                    sql += '(?),'
                    const { name } = item
                    values.push(name)
                })

                sql = sql.substring(0, sql.length - 1)
                
                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(results.insertId)
                    connection.end()
                })
            })
        })
    },
    noteUpdate: ({ id, data }) => {
        console.log('noteUpdate', id, data)
        const { name } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'UPDATE note SET'
                let values = []

                if(name !== undefined){
                    sql += ' name=?, '
                    values.push(name)
                }

                sql += ' id=? WHERE id=? '
                values.push(id)
                values.push(id)

                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(true)
                    connection.end()
                })
            })
        })
    },
    noteDelete: ({ id }) => {
        console.log('noteDelete', id)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const sql = 'DELETE FROM note WHERE id=?'
                const values = [id]
                console.log('sql', sql, values)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(true)
                    connection.end()
                })
            })
        })
    },
    noteBatchDelete: ({ ids }) => {
        console.log('noteBatchDelete', ids)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'DELETE FROM note WHERE id in ('

                const idsLen = ids.length

                if(idsLen > 0){
                    for(let i = 0; i < idsLen; i++){
                        sql += '?,'
                    }
    
                    sql = sql.substring(0, sql.length - 1)
                    sql += ')'
    
                    const values = ids
                    console.log('sql', sql, values)
    
                    connection.query(sql, values, (error, results, fields) => {
                        if (error) throw error
                        console.log('results', results)
    
                        resolve(true)
                        connection.end()
                    })
                }
                else 
                    reject()
            })
        })
    }
}