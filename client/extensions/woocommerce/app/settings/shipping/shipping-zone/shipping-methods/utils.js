/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import formatCurrency from 'lib/format-currency';

export const getMethodSummary = ( method, currency ) => {
	switch ( method.methodType ) {
		case 'flat_rate':
			return translate( 'Cost: %(cost)s', { args: {
				cost: formatCurrency( method.cost, currency ) || method.cost,
			} } );
		case 'free_shipping':
			if ( ! method.requires ) {
				return translate( 'For everyone' );
			}

			return translate( 'Minimum order amount: %(cost)s', { args: {
				cost: formatCurrency( method.min_amount, currency ) || method.min_amount,
			} } );
		case 'local_pickup':
			return translate( 'Cost: %(cost)s', { args: {
				cost: formatCurrency( method.cost, currency ) || method.cost,
			} } );
		default:
			return '';
	}
};
