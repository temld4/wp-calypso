/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import { getLink } from 'woocommerce/lib/nav-utils';
import { getMethodSummary } from './shipping-zone/shipping-methods/utils';
import { getSelectedSite } from 'state/ui/selectors';
import { getShippingZoneMethods } from 'woocommerce/state/ui/shipping/zones/methods/selectors';

const ShippingZoneEntry = ( { translate, id, name, methods, loaded, site } ) => {
	if ( ! loaded ) {
		return (
			<div className="shipping__zones-row is-placeholder">
				<div className="shipping__zones-row-icon">
					<Gridicon icon="globe" size={ 24 } />
				</div>
				<div className="shipping__zones-row-location">
					<p className="shipping__zones-row-location-name" />
					<p className="shipping__zones-row-location-description" />
				</div>
				<div className="shipping__zones-row-methods" >
					<div className="shipping__zones-row-method">
						<p className="shipping__zones-row-method-name" />
						<p className="shipping__zones-row-method-description" />
					</div>
					<div className="shipping__zones-row-method">
						<p className="shipping__zones-row-method-name" />
						<p className="shipping__zones-row-method-description" />
					</div>
				</div>
				<div className="shipping__zones-row-actions" >
					<Button compact>{ translate( 'Edit' ) }</Button>
				</div>
			</div>
		);
	}

	const renderMethod = ( methodKey ) => {
		const method = methods[ methodKey ];

		//TODO: remove hardcoded currency data
		return (
			<div key={ methodKey } className="shipping__zones-row-method">
				<p className="shipping__zones-row-method-name">{ method.title }</p>
				<p className="shipping__zones-row-method-description">{ getMethodSummary( method, '$' ) }</p>
			</div>
		);
	};

	const icon = 0 === id ? 'globe' : 'location';

	return (
		<div className="shipping__zones-row">
			<div className="shipping__zones-row-icon">
				<Gridicon icon={ icon } size={ 24 } />
			</div>
			<div className="shipping__zones-row-location">
				<p className="shipping__zones-row-location-name">{ name }</p>
				{ /*<p className="shipping__zones-row-location-description">{ locationDescription }</p>*/ }
			</div>
			<div className="shipping__zones-row-methods" key={ 0 }>
				{ Object.keys( methods ).map( renderMethod ) }
			</div>
			<div className="shipping__zones-row-actions" key={ 1 }>
				<Button compact href={ getLink( `/store/settings/shipping/:site/zone/${ id }`, site ) }>{ translate( 'Edit' ) }</Button>
			</div>
		</div>
	);
};

ShippingZoneEntry.propTypes = {
	id: PropTypes.oneOfType( [ PropTypes.number, PropTypes.object ] ),
	name: PropTypes.string,
	loaded: PropTypes.bool.isRequired,
};

export default connect(
	( state, ownProps ) => ( {
		site: getSelectedSite( state ),
		methods: ownProps.loaded && getShippingZoneMethods( state, ownProps.id ),
	} )
)( localize( ShippingZoneEntry ) );
