'use strict';
export const BASE_URL = 'http://freshbox-hi.com/';
export const BASE_MEDIA = 'http://freshbox-hi.com/api/pub/media/';
export const API_URL = 'http://freshbox-hi.com/api/';
export const BASE_API_URL = 'http://freshbox-hi.com/api/index.php/rest/V1/';
export const BASE_DEFAULT_API_URL = 'http://freshbox-hi.com/api/index.php/rest/default/V1/';
export const BASE_MEDIA_URL = 'http://freshbox-hi.com/api/pub/media/catalog/product';
// tslint:disable-next-line:max-line-length
export const pdfDataURL = 'data:image/png;base64,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';

export const htmlImages = 'http://freshbox-hi.com/images/';

export const ORDER_PDF_URL = "http://freshbox-hi.com/api/pdf_invoice_frontend/invoice/pdfdownload/?order_id=";
export const EXPORT_MEAL_SUB = "http://freshbox-hi.com/api/pdf_invoice_frontend/export/exceldownload/";
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const ADMIN_ID = 2;
