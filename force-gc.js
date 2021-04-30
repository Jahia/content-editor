// https://github.com/facebook/jest/issues/7311
afterEach(() => {
    if (global.gc) {
        global.gc();
    }
});
