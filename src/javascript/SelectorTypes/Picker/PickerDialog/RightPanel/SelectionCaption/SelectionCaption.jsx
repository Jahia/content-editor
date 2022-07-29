import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import css from './SelectionCaption.scss';

const SelectionCaption = ({selection}) => {
    const {t} = useTranslation('content-editor');
    return (
        <>
            {
                selection.length > 0 && (
                    <div className={clsx('flexCol', 'alignStart')}>
                        <div className={clsx('flexRow', 'alignCenter')}>
                            <img src={selection[0].url} alt=""/>
                            <Typography variant="body">{selection[0].name}</Typography>
                        </div>
                        <Typography variant="caption">{selection[0].path}</Typography>
                    </div>
                )
            }
            {
                selection.length === 0 && (
                    <Typography variant="caption"
                                className={css.caption}
                    >
                        {t('content-editor:label.contentEditor.picker.rightPanel.actionsCaption')}
                    </Typography>
                )
            }
        </>
    );
};

SelectionCaption.propTypes = {
    selection: PropTypes.array.isRequired
};

export default SelectionCaption;

