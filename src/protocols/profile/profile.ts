import { buildSchemasFromTypes } from "../utils"

const profileDefinition = {
  published: true,
  protocol: "https://areweweb5yet.com/protocols/profile",
  types: {
    name: {
      dataFormats: ['application/json']
    },
    social: {
      dataFormats: ['application/json']
    },
    messaging: {
      dataFormats: ['application/json']
    },
    phone: {
      dataFormats: ['application/json']
    },
    address: {
      dataFormats: ['application/json']
    },
    avatar: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    },
    hero: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    }
  },
  structure: {
    social: {},
    avatar: {},
    hero: {},
    name: {},
    messaging: {},
    address: {},
    phone: {}
  }
}

export const profile = {
  uri: profileDefinition.protocol,
  schemas: buildSchemasFromTypes(profileDefinition),
  definition: profileDefinition
};