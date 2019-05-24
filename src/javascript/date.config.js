import dayjs from 'dayjs';

import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import 'dayjs/locale/en';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);
