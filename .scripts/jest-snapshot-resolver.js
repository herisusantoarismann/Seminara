module.exports = {
    testPathForConsistencyCheck: 'some/example.test.js',
    resolveSnapshotPath: (testPath, snapshotExtension) => testPath + snapshotExtension,
    resolveTestPath: (snapshotFilePath, snapshotExtension) => snapshotFilePath.slice(0, -snapshotExtension.length),
}