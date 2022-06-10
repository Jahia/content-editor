import {registry} from '@jahia/ui-extender';
import {register} from './register';

export default function () {
    registry.add('callback', 'content-editor', {
        targets: ['jahiaApp-init:2'],
        callback: register
    });
}
