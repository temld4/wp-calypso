/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';

export const getMethodSummary = ( method, currencyPrefix = '', currencySuffix = '' ) => {
	switch ( method.methodType ) {
		case 'flat_rate':
			return translate( 'Cost: %(prefix)s%(cost)s%(suffix)s', { args: {
				prefix: currencyPrefix,
				cost: method.cost,
				suffix: currencySuffix,
			} } );
		case 'free_shipping':
			if ( ! method.requires ) {
				return translate( 'For everyone' );
			}

			return translate( 'Minimum order amount: %(prefix)s%(cost)s%(suffix)s', { args: {
				prefix: currencyPrefix,
				cost: method.min_amount,
				suffix: currencySuffix,
			} } );
		case 'local_pickup':
			return translate( 'Cost: %(prefix)s%(cost)s%(suffix)s', { args: {
				prefix: currencyPrefix,
				cost: method.cost,
				suffix: currencySuffix,
			} } );
		default:
			return '';
	}
};
