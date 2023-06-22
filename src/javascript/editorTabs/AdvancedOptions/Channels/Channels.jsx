import React from 'react';
import {useContentEditorSectionContext} from '~/contexts';
import {Validation} from '~/editorTabs/EditPanelContent/FormBuilder/Validation';
import {FieldSet} from '~/editorTabs/EditPanelContent/FormBuilder/FieldSet';
import styles from './Channels.scss';

const filterRegularFieldSets = fieldSets => {
    const showFieldSet = fieldSet => {
        if (!fieldSet) {
            return false;
        }

        if (fieldSet.dynamic && !fieldSet.hasEnableSwitch && !fieldSet.activated) {
            return false;
        }

        // We must hide fieldSet in the section when the fieldSet is not dynamic and
        // the fieldSet doesn't contain any fields (empty).
        return fieldSet.dynamic || fieldSet.fields.length > 0;
    };

    return fieldSets.filter(fs => showFieldSet(fs));
};

export const Channels = () => {
    const {sections} = useContentEditorSectionContext();

    const section = sections.filter(s => s.name === 'visibility');
    const fieldSets = filterRegularFieldSets(section[0].fieldSets);

    if (fieldSets.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Validation/>
            <section>
                { fieldSets?.map(fs => <FieldSet key={fs.name} fieldset={fs}/>) }
            </section>
        </div>
    );
};
