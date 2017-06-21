/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import ExtendedHeader from 'woocommerce/components/extended-header';
import FormToggle from 'components/forms/form-toggle/compact';
import List from 'woocommerce/components/list/list';
import ListItem from 'woocommerce/components/list/list-item';
import ListHeader from 'woocommerce/components/list/list-header';
import ListItemField from 'woocommerce/components/list/list-item-field';
import ShippingZoneMethodDialog from './shipping-zone-method-dialog';
import Spinner from 'components/spinner';
import { getMethodSummary } from './shipping-methods/utils';
import {
	getShippingMethodNameMap,
} from 'woocommerce/state/sites/shipping-methods/selectors';
import {
	openShippingZoneMethod,
	addMethodToShippingZone,
	toggleShippingZoneMethodEnabled,
} from 'woocommerce/state/ui/shipping/zones/methods/actions';
import {
	getCurrentlyEditingShippingZoneMethods,
	getNewMethodTypeOptions,
} from 'woocommerce/state/ui/shipping/zones/methods/selectors';

const ShippingZoneMethodList = ( {
		siteId,
		loaded,
		methods,
		methodNamesMap,
		newMethodTypeOptions,
		translate,
		onChange,
		actions,
	} ) => {
	const renderMethod = ( method, index ) => {
		const onEditClick = () => ( actions.openShippingZoneMethod( siteId, method.id ) );
		const onEnabledToggle = () => ( actions.toggleShippingZoneMethodEnabled( siteId, method.id, ! method.enabled ) );

		//TODO: remove hardcoded currency data
		return (
			<ListItem key={ index } >
				<ListItemField className="shipping-zone__method-title">
					{ method.title }
				</ListItemField>
				<ListItemField className="shipping-zone__method-summary">
					{ getMethodSummary( method, '$' ) }
				</ListItemField>
				<ListItemField className="shipping-zone__enable-container">
					<span>
						{ translate( 'Enabled {{toggle/}}', {
							components: {
								toggle: <FormToggle checked={ method.enabled } onChange={ onEnabledToggle } />
							}
						} ) }
					</span>
				</ListItemField>
				<ListItemField className="shipping-zone__method-actions">
					<Button compact onClick={ onEditClick }>{ translate( 'Edit' ) }</Button>
				</ListItemField>
			</ListItem>
		);
	};

	const renderContent = () => {
		if ( ! loaded ) {
			return (
				<div className="shipping-zone__loading-spinner">
					<Spinner size={ 24 } />
				</div>
			);
		}

		return methods.map( renderMethod );
	};

	const onAddMethod = () => {
		if ( ! loaded ) {
			return;
		}
		onChange();

		const newType = newMethodTypeOptions[ 0 ];
		actions.addMethodToShippingZone( siteId, newType, methodNamesMap( newType ) );
	};

	return (
		<div className="shipping-zone__methods-container">
			<ExtendedHeader
				label={ translate( 'Shipping methods' ) }
				description={ translate( 'Any customers that reside in the locations' +
					' defined above will have access to these shipping methods' ) } >
				<Button onClick={ onAddMethod } disabled={ ! loaded } >{ translate( 'Add method' ) }</Button>
			</ExtendedHeader>
			<List>
				<ListHeader>
					<ListItemField className="shipping-zone__methods-column-title">
						{ translate( 'Method' ) }
					</ListItemField>
					<ListItemField className="shipping-zone__methods-column-summary">
						{ translate( 'Details' ) }
					</ListItemField>
				</ListHeader>
				{ renderContent() }
			</List>
			<ShippingZoneMethodDialog siteId={ siteId } onChange={ onChange } />
		</div>
	);
};

ShippingZoneMethodList.propTypes = {
	siteId: PropTypes.number,
	onChange: PropTypes.func.isRequired,
};

export default connect(
	( state ) => ( {
		methods: getCurrentlyEditingShippingZoneMethods( state ),
		methodNamesMap: getShippingMethodNameMap( state ),
		newMethodTypeOptions: getNewMethodTypeOptions( state ),
	} ),
	( dispatch ) => ( {
		actions: bindActionCreators( {
			openShippingZoneMethod,
			addMethodToShippingZone,
			toggleShippingZoneMethodEnabled,
		}, dispatch )
	} )
)( localize( ShippingZoneMethodList ) );
