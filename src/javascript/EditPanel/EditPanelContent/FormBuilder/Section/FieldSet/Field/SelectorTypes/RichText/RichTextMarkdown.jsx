import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';
import MarkdownIt from 'markdown-it';
import {gfm} from 'turndown-plugin-gfm';
import TurndownService from 'turndown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './RichTextMarkdown.css';

const RichTextMarkdown = ({field, id, value}) => {
    const [valueText, setValueText] = useState('');

    const converter = new TurndownService({headingStyle: 'atx'}).use(gfm);
    const mdParser = new MarkdownIt(/* Markdown-it options */);

    const config = {
        view: {
            menu: true,
            md: true,
            html: false
        }
    };

    return (
        <FastField
            name={field.name}
            render={({form: {setFieldValue, setFieldTouched}}) => {
                const onEditorChange = value => {
                    setFieldValue(
                        id,
                        value,
                        true
                    );
                    setFieldTouched(field.name, field.multiple ? [true] : true);
                };

                return (
                    <MdEditor
                        value={valueText || (value && converter.turndown(value))}
                        style={{height: '500px', width: '100%'}}
                        config={config}
                        renderHTML={text => {
                            setValueText(text);

                            return mdParser.render(text);
                        }}
                        onChange={({html}) => onEditorChange(html)}
                    />
                );
            }}
        />
    );
};

RichTextMarkdown.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired
};

RichTextMarkdown.displayName = 'RichTextMarkdown';
export default RichTextMarkdown;
