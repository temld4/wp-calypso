/**
 * External dependencies
 */
import React from 'react';

const TitleItem = props => {
	/* eslint-disable wpcalypso/jsx-classname-namespace */
	return (
		<h6 className="section-nav-tab__link">{ props.children }</h6>
	);
};

export default TitleItem;
