/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Gridicon from 'gridicons';
import FoldableCard from 'components/foldable-card';
import EllipsisMenu from 'components/ellipsis-menu';
import PopoverMenuItem from 'components/popover/menu-item';
import Gravatar from 'components/gravatar';

class ActivityLogItem extends Component {

	static propTypes = {
		allowRestore: PropTypes.bool.isRequired,
		siteId: PropTypes.number.isRequired,
		requestRestore: PropTypes.func.isRequired,

		log: PropTypes.shape( {
			group: PropTypes.string,
			name: PropTypes.string.isRequired,
			ts_site: PropTypes.number.isRequired,
			ts_utc: PropTypes.number.isRequired,

			actor: PropTypes.shape( {
				display_name: PropTypes.string,
				login: PropTypes.string,
				translated_role: PropTypes.string,
				user_email: PropTypes.string,
				user_roles: PropTypes.string,
				wpcom_user_id: PropTypes.number,
			} ),

			object: PropTypes.shape( {
				post: PropTypes.shape( {
					id: PropTypes.number.isRequired,
					status: PropTypes.string,
					type: PropTypes.string,
					title: PropTypes.string,
				} ),

				comment: PropTypes.shape( {
					approved: PropTypes.bool,
					id: PropTypes.number,
				} ),

				user: PropTypes.shape( {
					display_name: PropTypes.string,
					login: PropTypes.string,
				} ),

			} ),
		} ).isRequired,
	};

	static defaultProps = { allowRestore: true };

	handleClickRestore = () => {
		const {
			requestRestore,
			log,
		} = this.props;
		requestRestore( log.ts_utc );
	};

	getTime() {
		const {
			moment,
			log,
		} = this.props;

		return (
			<div className="activity-log-item__time">
				{ moment( log.ts_site ).format( 'LT' ) }
			</div>
		);
	}

	getIcon() {
		const { log } = this.props;
		const classes = classNames(
			'activity-log-item__icon',
			this.getStatus(),
		);
		let icon = 'info-outline';
		switch ( log.name ) {
			case '':
				icon = icon;
				break;
		}

		return (
			<div className={ classes }>
				<Gridicon icon={ icon } size={ 24 } />
			</div>
		);
	}

	getStatus() {
	}

	getActor() {
		const { log } = this.props;
		const { actor } = log;

		if ( ! actor || ! actor.wpcom_user_id ) {
			return null;
		}

		return (
			<div className="activity-log-item__actor">
				<Gravatar user={ { ID: actor.wpcom_user_id, display_name: actor.display_name } } size={ 48 } />
				<div className="activity-log-item__actor-info">
					<div className="activity-log-item__actor-name">{ actor.display_name }</div>
					<div className="activity-log-item__actor-role">{ actor.translated_role }</div>
				</div>
			</div>
		);
	}

	getContent() {
		const { log } = this.props;
		const {
			name,
		} = log;

		const subTitle = null;

		return (
			<div className="activity-log-item__content">
				<div className="activity-log-item__content-title">{ name }</div>
				{ subTitle && <div className="activity-log-item__content-sub-title">{ subTitle }</div> }
			</div>
		);
	}

	getSummary() {
		const {
			allowRestore,
			translate,
		} = this.props;

		if ( ! allowRestore ) {
			return null;
		}

		return (
			<div className="activity-log-item__action">
				<EllipsisMenu position="bottom right">
					<PopoverMenuItem onClick={ this.handleClickRestore } icon="undo">
						{ translate( 'Rewind to this point' ) }
					</PopoverMenuItem>
				</EllipsisMenu>
			</div>
		);
	}

	getHeader() {
		return (
			<div className="activity-log-item__card-header">
				{ this.getActor() }
				{ this.getContent() }
			</div>
		);
	}

	render() {
		const {
			className,
			description,
		} = this.props;

		const classes = classNames(
			'activity-log-item',
			className
		);
		return (
			<div className={ classes } >
				<div className="activity-log-item__type">
					{ this.getTime() }
					{ this.getIcon() }
				</div>
				<FoldableCard
					className="activity-log-item__card"
					header={ this.getHeader() }
					summary={ this.getSummary() }
					expandedSummary={ this.getSummary() }
					clickableHeader={ true }
				>
					{ description }
				</FoldableCard>
			</div>
		);
	}
}

export default localize( ActivityLogItem );
