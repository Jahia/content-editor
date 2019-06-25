import dayjs from 'dayjs';

import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/pt';
import 'dayjs/locale/it';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(LocalizedFormat);
dayjs.extend(customParseFormat);

export default dayjs;
