import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {SectionsPropTypes} from '~/ContentEditor.proptypes';
import {ChildrenSection, Section} from './Sections';
import styles from './FormBuilder.scss';
import {Validation} from './Validation';

const ADVANCED_OPTIONS_SELECTIONS = ['visibility'];

export const FormBuilder = ({mode}) => {
    const {nodeData, errors} = useContentEditorContext();
    const {expanded, setExpanded} = useContentEditorConfigContext();
    const {sections} = useContentEditorSectionContext();

    // Update toggle state if there are errors
    useEffect(() => {
        if (errors) {
            sections.forEach(section => {
                section.fieldSets.forEach(fieldSet => {
                    fieldSet.fields.forEach(field => {
                        if (errors[field.name] && !expanded[section.name]) {
                            setExpanded({...expanded, [section.name]: true});
                        }
                    });
                });
            });
        }
    }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps

    // On mount/unmount hook
    useEffect(() => {
        document.querySelector('div[data-first-field=true] input')?.focus();
    }, []);

    if (!nodeData || !sections || sections.length === 0) {
        return <></>;
    }

    let listOrderingIndex = -1;
    const children = sections.filter(s => !ADVANCED_OPTIONS_SELECTIONS.includes(s.name)).map((section, index) => {
        const toggleFcn = e => {
            e.preventDefault();
            setExpanded({...expanded, [section.name]: !expanded[section.name]});
        };

        if (section.name === 'listOrdering') {
            listOrderingIndex = index;
            return (
                <ChildrenSection key={section.name}
                                 mode={mode}
                                 nodeData={nodeData}
                                 section={section}
                                 isExpanded={expanded[section.name]}
                                 onClick={toggleFcn}
                />
            );
        }

        if (!section.hide) {
            return (
                <Section key={section.name}
                         section={section}
                         isExpanded={expanded[section.name]}
                         onClick={toggleFcn}
                />
            );
        }

        return null;
    });

    if (listOrderingIndex !== -1) {
        const lo = children.splice(listOrderingIndex, 1);
        children.splice(1, 0, lo);
    }

    return (
        <>
            <Validation/>
            <Form className={styles.form}>
                <section data-sel-mode={mode}>
                    {children}
                </section>
            </Form>
        </>
    );
};

FormBuilder.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired,
        nodeData: PropTypes.object.isRequired
    })
};

FormBuilder.propTypes = {
    mode: PropTypes.string.isRequired
};
