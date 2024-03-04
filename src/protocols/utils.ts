import { ProtocolDefinition } from '@tbd54566975/dwn-sdk-js';

export function buildSchemasFromTypes(config: ProtocolDefinition) {
  const types = config.types;
  const protocolUri = config.protocol;

  return Object.entries(types).reduce((result, [key, value]) => {
    if (value.dataFormats?.length === 1) {
      result = {
        ...result,
        key: types[key].schema = protocolUri + '/schemas/' + key
      };
    }
    return result;
  }, {})
}