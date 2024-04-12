import { buildSchemasFromTypes } from "../utils"

const notebookDefinition = {
  published: true,
  protocol: "https://areweweb5yet.com/protocols/notes",
  types: {
    notebook: {
      dataFormats: ['application/json']
    },
    metaData: {
      dataFormats: ['application/json']
    },
    page: {
      dataFormats: ['application/json']
    },
    section: {
      dataFormats: ['application/json', 'text/markdown', 'text/plain', 'image/jpeg', 'image/png']
    },
  },
  structure: {
    notebook: {
      metaData: {},
      page: {
        section: {}
      }
    }
  }
}

export const notebook = {
  uri: notebookDefinition.protocol,
  schemas: buildSchemasFromTypes(notebookDefinition),
  definition:notebookDefinition 
};