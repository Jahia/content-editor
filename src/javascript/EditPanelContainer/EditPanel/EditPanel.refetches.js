const editPanelRefetches = {};

let triggerRefetch = key => {
    let refetch = editPanelRefetches[key];
    if (!refetch) {
        return;
    }

    refetch.refetch();
};

let setPreviewRefetcher = refetcherData => {
    // In content editor only the path and the language can change for the preview query, so just this parameters to build a key
    // ideally the key of a refetcher should be all it's queryParams.
    editPanelRefetches[buildPreviewRefetcherKey(refetcherData.queryParams.path, refetcherData.queryParams.language)] = refetcherData;
};

let refetchPreview = (path, language) => {
    triggerRefetch(buildPreviewRefetcherKey(path, language));
};

let buildPreviewRefetcherKey = (path, language) => {
    return path + '_' + language;
};

export {
    setPreviewRefetcher,
    refetchPreview
};
