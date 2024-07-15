module.exports = {
    query: `
        note(page: Int, pageSize: Int): Notes
        noteGet(id: Int): Note
        noteSearch(page: Int, pageSize: Int, data: NoteSearchInput): Notes
    `,
    mutation: `
        noteAdd(data: NoteAddInput): Int
        noteBatchAdd(datas: [NoteAddInput]): Int
        noteUpdate(id: Int, data: NoteAddInput): Boolean
        noteDelete(id: Int): Boolean
        noteBatchDelete(ids: [Int]): Boolean
    `,
    subscription: ``,
    type: `
        type Note {
            id: Int
            name: String
        }

        type Notes {
            totalCounts: Int
            items: [Note]
        }

        input NoteAddInput {
            name: String
        }

        input NoteSearchInput {
            name: String
        }
    `
} 