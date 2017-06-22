/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import ActionHeader from 'woocommerce/components/action-header';
import { getLink } from 'woocommerce/lib/nav-utils';
import { getSelectedSiteWithFallback } from 'woocommerce/state/sites/selectors';
import Main from 'components/main';
import ShippingLabels from './shipping-labels';
import ShippingOrigin from './shipping-origin';
import ShippingPackageList from './shipping-package-list';
import ShippingZoneList from './shipping-zone-list';

const Shipping = ( { className, site, translate } ) => {
	const breadcrumbs = ( <span>
		<a href={ getLink( '/store/:site/', site ) }>{ translate( 'Settings' ) }</a> &gt; { translate( 'Shipping' ) }
	</span> );
	return (
		<Main className={ classNames( 'shipping', className ) }>
			<ActionHeader breadcrumbs={ breadcrumbs } />
			<ShippingOrigin />
			<ShippingZoneList />
			<ShippingLabels />
			<ShippingPackageList />
		</Main>
	);
};

Shipping.propTypes = {
	site: PropTypes.shape( {
		slug: PropTypes.string,
	} ),
	className: PropTypes.string,
};

function mapStateToProps( state ) {
	const site = getSelectedSiteWithFallback( state );
	return {
		site,
	};
}

export default connect( mapStateToProps )( localize( Shipping ) );
