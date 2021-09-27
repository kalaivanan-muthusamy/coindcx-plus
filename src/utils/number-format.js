export function formatNumber(value, region = 'en-IN') {
    return new Intl.NumberFormat(region).format(value)
}

export function formatCurrency(value, region = 'en-IN', currency = 'INR') {
    return new Intl.NumberFormat(region, { style: 'currency', currency }).format(value);
}

export function roundOff(number, precision = 2) {
    return Number.parseFloat(number).toFixed(precision);
}