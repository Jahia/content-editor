import {registry} from '@jahia/ui-extender';
import register from './ContentEditor.register';

export default function () {
    registry.add('callback', 'content-editor', {
        targets: ['jahiaApp-init:2'],
        callback: register
    });
}
