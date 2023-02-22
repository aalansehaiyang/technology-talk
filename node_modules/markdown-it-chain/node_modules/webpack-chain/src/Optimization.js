const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend([
      'concatenateModules',
      'flagIncludedChunks',
      'mergeDuplicateChunks',
      'minimize',
      'minimizer',
      'namedChunks',
      'namedModules',
      'nodeEnv',
      'noEmitOnErrors',
      'occurrenceOrder',
      'portableRecords',
      'providedExports',
      'removeAvailableModules',
      'removeEmptyChunks',
      'runtimeChunk',
      'sideEffects',
      'splitChunks',
      'usedExports',
    ]);
  }
};
