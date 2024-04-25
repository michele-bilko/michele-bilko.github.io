import { $fetch } from 'ofetch';
import { b as createCDNFetchLoader } from './preset-icons.DTqACBfB.mjs';

function createCDNLoader(cdnBase) {
  return createCDNFetchLoader($fetch, cdnBase);
}

export { createCDNLoader as c };
