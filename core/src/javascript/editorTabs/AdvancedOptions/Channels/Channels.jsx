import React from 'react';
import {useContentEditorSectionContext} from '../../../contexts';
import {Validation} from '../../EditPanelContent/FormBuilder/Validation';
import {FieldSetsDisplay} from '../../EditPanelContent/FormBuilder/FieldSet';
import styles from './Channels.scss';

const filterRegularFieldSets = fieldSets => {
    const hideFieldSet = fieldSet => {
        if (!fieldSet) {
            return false;
        }

        if (!fieldSet.displayed) {
            return true;
        }

        // We must hide fieldSet in the section when the fieldSet is not dynamic and
        // the fieldSet doesn't contain any fields (empty).
        return !fieldSet.dynamic && fieldSet.fields.length === 0;
    };

    return fieldSets.filter(fs => !hideFieldSet(fs));
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
                <FieldSetsDisplay fieldSets={fieldSets}/>
            </section>
        </div>
    );
};
