import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'formik';
import {Collapsible} from '@jahia/moonstone';

import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {SectionsPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {OrderingSection} from './OrderingSection';
import {filterRegularFieldSets} from '~/EditPanel/EditPanelContent/FormBuilder/FormBuilder.fieldSetHelp';
import FieldSetsDisplay from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/FieldSetsDisplay/FieldSetsDisplay';
import styles from './FormBuilder.scss';

const DEFAULT_OPENED_SECTIONS = {content: true, listOrdering: true};

const FormBuilderCmp = ({mode}) => {
    const {nodeData, errors} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const [toggleStates, setToggleStates] = useState(sections ? sections.reduce((acc, curr) => ({...acc, [curr.name]: acc[curr.name] ? acc[curr.name] : curr.expanded}), DEFAULT_OPENED_SECTIONS) : {});

    // Update toggle state if there are errors
    useEffect(() => {
        if (errors) {
            const newToggleState = {...toggleStates};
            sections.forEach(section => {
                section.fieldSets.forEach(fieldSet => {
                    fieldSet.fields.forEach(field => {
                        if (errors[field.name]) {
                            newToggleState[section.name] = true;
                        }
                    });
                });
            });
            setToggleStates(newToggleState);
        }
    }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!nodeData || !sections || sections.length === 0) {
        return <></>;
    }

    let listOrderingIndex = -1;
    const children = sections.map((section, index) => {
        if (section.name === 'listOrdering') {
            listOrderingIndex = index;
            return (
                <Collapsible key={section.name}
                             data-sel-content-editor-fields-group={section.displayName}
                             className={styles.title}
                             label={section.displayName}
                             isExpanded={toggleStates[section.name]}
                             onClick={e => {
                                 e.preventDefault();
                                 setToggleStates({...toggleStates, [section.name]: !toggleStates[section.name]});
                             }}
                >
                    <OrderingSection key="ordering"
                                     mode={mode}
                                     nodeData={nodeData}
                                     section={section}
                    />
                </Collapsible>
            );
        }

        if (!section.hide) {
            return (
                <Collapsible key={section.name}
                             data-sel-content-editor-fields-group={section.displayName}
                             className={styles.title}
                             label={section.displayName}
                             isExpanded={toggleStates[section.name]}
                             onClick={e => {
                                 e.preventDefault();
                                 setToggleStates({...toggleStates, [section.name]: !toggleStates[section.name]});
                             }}
                >
                    <FieldSetsDisplay fieldSets={filterRegularFieldSets(section.fieldSets)}/>
                </Collapsible>
            );
        }

        return null;
    });

    if (listOrderingIndex !== -1) {
        const lo = children.splice(listOrderingIndex, 1);
        children.splice(1, 0, lo);
    }

    return (
        <Form>
            <section data-sel-mode={mode}>
                {children}
            </section>
        </Form>
    );
};

FormBuilderCmp.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired,
        nodeData: PropTypes.object.isRequired
    })
};

FormBuilderCmp.propTypes = {
    mode: PropTypes.string.isRequired
};

const FormBuilder = FormBuilderCmp;

export default FormBuilder;
