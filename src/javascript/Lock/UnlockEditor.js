import {UnlockEditorMutation} from './UnlockEditor.gql-mutation';
import PropTypes from 'prop-types';
import {useEditorIdContext} from '../ContentEditorId.context';

export const useUnlockEditor = client => {
    const {editorId} = useEditorIdContext();

    return {
        unlockEditor: unlockCallback => {
            client.mutate({
                variables: {
                    editorID: editorId
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
