/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import SectionHeader from 'components/section-header';
import Button from 'components/button';

class ExtendedHeader extends Component {
	render() {
		const { label, description, children, buttonAction, buttonText } = this.props;

		const labelContent = (
			<div>
				<div className="extended-header__header">{ label }</div>
				<div className="extended-header__header-description">{ description }</div>
			</div>
		);

		return (
			<SectionHeader className="section-header-extended" label={ labelContent }>
				{ children }
				{
					buttonText && buttonAction &&
						<Button onClick={ buttonAction }>
							{ buttonText }
						</Button>
				}

			</SectionHeader>
		);
	}
}

export default ExtendedHeader;
