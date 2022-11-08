import React from 'react';
import {useContentEditorSectionContext} from '~/contexts';
import {Validation} from '~/editorTabs/EditPanelContent/FormBuilder/Validation';
import {Form} from 'formik';
import {FieldSetsDisplay} from '~/editorTabs/EditPanelContent/FormBuilder/FieldSet';
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
        <>
            <Validation/>
            <Form>
                <section className={styles.container}>
                    <FieldSetsDisplay fieldSets={fieldSets}/>
                </section>
            </Form>
        </>
    );
};
