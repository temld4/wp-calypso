/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';

export const getMethodSummary = ( method ) => {
	switch ( method.methodType ) {
		case 'flat_rate':
			return translate( 'Cost: %s', { args: [ method.cost ] } );
		case 'free_shipping':
			if ( ! method.requires ) {
				return translate( 'For everyone' );
			}

			return translate( 'Minimum order amount: %s', { args: [ method.min_amount ] } );
		case 'local_pickup':
			return translate( 'Cost: %s', { args: [ method.cost ] } );
		default:
			return '';
	}
};
