import { createCommonJS } from 'mlly';
const { require: mllyRequire } = createCommonJS(import.meta.url);
const sharp = mllyRequire('sharp');

export default sharp;
