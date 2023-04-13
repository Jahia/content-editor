import dayjs from 'dayjs';

import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import 'dayjs/locale/en';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(LocalizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default dayjs;
