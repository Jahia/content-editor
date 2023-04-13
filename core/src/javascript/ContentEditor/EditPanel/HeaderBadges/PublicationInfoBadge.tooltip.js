import dayjs from 'dayjs';
import {Constants} from '../../../ContentEditor.constants';

function formatDate(date, locale, format = 'LLL') {
    return dayjs(date).locale(locale).format(format);
}

const tooltips = {
    modified: (publicationInfoContext, uilang) => {
        return {
            key: 'label.contentEditor.publicationStatusTooltip.modified',
            args: {
                userName: publicationInfoContext.lastModifiedBy || '?',
                timestamp: formatDate(publicationInfoContext.lastModified, uilang)
            }
        };
    },
    published: (publicationInfoContext, uilang) => {
        return {
            key: 'label.contentEditor.publicationStatusTooltip.published',
            args: {
                userName: publicationInfoContext.lastPublishedBy || '?',
                timestamp: formatDate(publicationInfoContext.lastPublished, uilang)
            }
        };
    },
    warning: publicationInfoContext => {
        const resolveKey = status => {
            switch (status) {
                case Constants.editPanel.publicationStatus.CONFLICT:
                    return 'label.contentEditor.publicationStatusTooltip.conflict';
                case Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_VALID:
                    return 'label.contentEditor.publicationStatusTooltip.mandatoryLanguageValid';
                case Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE:
                    return 'label.contentEditor.publicationStatusTooltip.mandatoryLanguageUnpublishable';
                default:
                    return 'label.contentEditor.publicationStatusTooltip.unknown';
            }
        };

        return {
            key: resolveKey(publicationInfoContext.publicationStatus)
        };
    }
};

function getTooltip(type, publicationInfoContext, uilang, t) {
    const provider = tooltips[type];

    if (provider) {
        const tooltip = provider(publicationInfoContext, uilang);
        return t(tooltip.key, tooltip.args);
    }

    return '';
}

export {getTooltip};
