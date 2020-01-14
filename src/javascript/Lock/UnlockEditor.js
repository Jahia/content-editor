import {UnlockEditorMutation} from './UnlockEditor.gql-mutation';
import {getLockEditorId} from './LockUtils';
import PropTypes from 'prop-types';

export const useUnlockEditor = client => {
    return {
        unlockEditor: unlockCallback => {
            client.mutate({
                variables: {
                    editorID: getLockEditorId()
                },
                mutation: UnlockEditorMutation
            }).then(() => {
                if (unlockCallback) {
                    unlockCallback();
                }
            }, error => {
                console.error(error);
            });
        }
    };
};

useUnlockEditor.propTypes = {
    client: PropTypes.object.isRequired
};
