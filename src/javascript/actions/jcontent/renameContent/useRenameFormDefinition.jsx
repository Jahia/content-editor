import {useFormDefinition} from '~/contexts/ContentEditor/useFormDefinitions';
import {EditFormQuery} from '~/ContentEditor/edit.gql-queries';
import {adaptEditFormData} from '~/ContentEditor/adaptEditFormData';

const renameAdaptEditFormData = (data, lang, t) => {
    const formData = adaptEditFormData(data, lang, t);

    formData.sections = formData.sections.filter(s => s.name === 'content');
    formData.sections[0].hideHeader = true;
    formData.sections[0].fieldSets.forEach(fs => {
        fs.fields = fs.fields.filter(f => f.name === 'nt:base_ce:systemName' || f.propertyName === 'jcr:title');
    });
    formData.sections[0].fieldSets = formData.sections[0].fieldSets.filter(fs => fs.fields.length > 0);

    return formData;
};

export const useRenameFormDefinition = () => useFormDefinition(EditFormQuery, renameAdaptEditFormData);
