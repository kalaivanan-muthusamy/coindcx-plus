
import { moment } from 'moment';

export function dateFormatter(utcString, format = 'DD-MM-YYYY') {
    console.log({ utcString, format })
    return moment(utcString).format(format)
}