import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import css from './SelectionCaption.scss';
import {NodeIcon} from '@jahia/jcontent';

const SelectionCaption = ({selection}) => {
    const {t} = useTranslation('content-editor');
    return (
        <>
            {
                selection.length > 0 && (
                    <div className={clsx('flexCol', 'flexFluid', 'alignStart')}>
                        <div className={clsx('flexRow_nowrap', 'alignCenter', css.text)}>
                            <NodeIcon node={selection[0]}/>
                            <Typography isNowrap variant="body">{selection[0].displayName}</Typography>
                        </div>
                        <Typography variant="caption">{selection[0].path}</Typography>
                    </div>
                )
            }
            {
                selection.length === 0 && (
                    <div className={clsx('flexCol', 'flexFluid', 'alignStart', css.text)}>
                        <Typography variant="caption"
                                    className={css.caption}
                        >
                            {t('content-editor:label.contentEditor.picker.rightPanel.actionsCaption')}
                        </Typography>
                    </div>
                )
            }
        </>
    );
};

SelectionCaption.propTypes = {
    selection: PropTypes.array.isRequired
};

export default SelectionCaption;

