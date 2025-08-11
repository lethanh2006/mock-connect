import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // chỉ cần import 1 lần
import advancedFormat from 'dayjs/plugin/advancedFormat';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// Extend plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(minMax);
dayjs.extend(duration);
dayjs.extend(calendar);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

// Set locale + timezone
dayjs.locale('vi');
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

export default dayjs;
