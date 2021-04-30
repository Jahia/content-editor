// https://github.com/facebook/jest/issues/7311
afterAll(() => {
    if (global.gc) {
        global.gc();
    }
});
