import {useEditFormDefinition} from '~/ContentEditor/useEditFormDefinition';

export const useRenameFormDefinition = () => {
    const {data, refetch, loading, error, errorMessage} = useEditFormDefinition();

    if (data) {
        data.sections = data.sections.filter(s => s.name === 'content');
        data.sections[0].hideHeader = true;
        data.sections[0].fieldSets.forEach(fs => {
            fs.hideHeader = true;
            fs.fields = fs.fields.filter(f => f.name === 'nt:base_ce:systemName');
        });
        data.sections[0].fieldSets = data.sections[0].fieldSets.filter(fs => fs.fields.length > 0);
    }

    return {data, refetch, loading, error, errorMessage};
};
