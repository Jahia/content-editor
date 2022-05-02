import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Section} from './Section';
import {Form} from 'formik';

import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {SectionsPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {OrderingSection} from './OrderingSection';
import {filterRegularFieldSets} from '~/EditPanel/EditPanelContent/FormBuilder/FormBuilder.fieldSetHelp';
import FieldSetsDisplay from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/FieldSetsDisplay/FieldSetsDisplay';

const DEFAULT_OPENED_SECTIONS = {content: true, listOrdering: true};

const FormBuilderCmp = ({mode}) => {
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const [toggleStates, setToggleStates] = useState(sections ? sections.reduce((acc, curr) => ({...acc, [curr.name]: acc[curr.name] ? acc[curr.name] : curr.expanded}), DEFAULT_OPENED_SECTIONS) : {});

    if (!nodeData || !sections || sections.length === 0) {
        return <></>;
    }

    console.log(sections);

    let listOrderingIndex = -1;
    const children = sections.map((section, index) => {
        if (section.name === 'listOrdering') {
            listOrderingIndex = index;
            return (
                <Section key={section.displayName}
                         section={section}
                         expanded={toggleStates[section.name]}
                         toggleExpanded={(name, expanded) => {
                             setToggleStates({...toggleStates, [name]: expanded});
                         }}
                >
                    <OrderingSection key="ordering"
                                     mode={mode}
                                     nodeData={nodeData}
                                     section={section}
                    />
                </Section>
            );
        }

        if (!section.hide) {
            return (
                <Section key={section.displayName}
                         section={section}
                         expanded={toggleStates[section.name]}
                         toggleExpanded={(name, expanded) => {
                             setToggleStates({...toggleStates, [name]: expanded});
                         }}
                >
                    <FieldSetsDisplay fieldSets={filterRegularFieldSets(section.fieldSets)}/>
                </Section>
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
