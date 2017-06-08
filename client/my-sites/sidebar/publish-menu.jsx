/**
 * External dependencies
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compact, includes, omit, reduce, get, mapValues } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import SidebarItem from 'layout/sidebar/item';
import SidebarButton from 'layout/sidebar/button';
import config from 'config';
import { getEditorPath } from 'state/ui/editor/selectors';
import { getPostTypes } from 'state/post-types/selectors';
import QueryPostTypes from 'components/data/query-post-types';
import analytics from 'lib/analytics';
import { decodeEntities } from 'lib/formatting';
import MediaLibraryUploadButton from 'my-sites/media-library/upload-button';
import { getSite, getSiteAdminUrl, getSiteSlug, isJetpackSite, isSingleUserSite } from 'state/sites/selectors';
import { areAllSitesSingleUser, canCurrentUser } from 'state/selectors';

class PublishMenu extends PureComponent {
	static propTypes = {
		itemLinkClass: PropTypes.func,
		onNavigate: PropTypes.func,
		siteId: PropTypes.number,
		// connected props
		allSingleSites: PropTypes.bool,
		canUserEditPosts: PropTypes.bool,
		isJetpack: PropTypes.bool,
		isSingleUser: PropTypes.bool,
		postTypes: PropTypes.object,
		postTypeLinks: PropTypes.object,
		siteAdminUrl: PropTypes.string,
		site: PropTypes.oneOfType( [
			PropTypes.object,
			PropTypes.bool
		] ),
		siteSlug: PropTypes.string,
	}

	// We default to `/my` posts when appropriate
	getMyParameter() {
		const { allSingleSites, isJetpack, isSingleUser, siteId } = this.props;

		if ( siteId ) {
			return ( isSingleUser || isJetpack ) ? '' : '/my';
		}

		// FIXME: If you clear `IndexedDB` and land on a site that has yourself as its only user,
		// and then navigate to multi-site mode, the `areAllSites` predicate will return true,
		// as long as no other sites have been fetched into Redux state. As a consequence, the
		// 'Posts' link will point to `/posts` (instead of `/posts/my` as it should, when you have
		// sites with other users).
		// The fix will be to make sure all sites are fetched into Redux state, see
		// https://github.com/Automattic/wp-calypso/pull/13094
		return ( allSingleSites ) ? '' : '/my';
	}

	getDefaultMenuItems() {
		const { siteSlug } = this.props;

		const items = [
			{
				name: 'post',
				label: this.props.translate( 'Blog Posts' ),
				config: 'manage/posts',
				queryable: true,
				link: '/posts' + this.getMyParameter(),
				paths: [ '/posts', '/posts/my' ],
				buttonLink: siteSlug ? '/post/' + siteSlug : '/post',
				wpAdminLink: 'edit.php',
				showOnAllMySites: true,
			},
			{
				name: 'page',
				label: this.props.translate( 'Pages' ),
				queryable: true,
				config: 'manage/pages',
				link: '/pages',
				buttonLink: siteSlug ? '/page/' + siteSlug : '/page',
				wpAdminLink: 'edit.php?post_type=page',
				showOnAllMySites: true,
			}
		];

		if ( config.isEnabled( 'manage/media' ) ) {
			items.push( {
				name: 'media',
				label: this.props.translate( 'Media' ),
				queryable: true,
				config: 'manage/media',
				link: '/media',
				buttonLink: '/media/' + siteSlug,
				wpAdminLink: 'upload.php',
				showOnAllMySites: false,
			} );
		}
		return items;
	}

	onNavigate = ( postType ) => () => {
		if ( ! includes( [ 'post', 'page' ], postType ) ) {
			analytics.mc.bumpStat( 'calypso_publish_menu_click', postType );
		}

		this.props.onNavigate();
	}

	renderMenuItem( menuItem ) {
		const { site, siteId, siteAdminUrl } = this.props;

		// Hide the sidebar link for media
		if ( 'attachment' === menuItem.name ) {
			return null;
		}

		// Hide the sidebar link for multiple site view if it's not in calypso, or
		// if it opts not to be shown.
		const isEnabled = config.isEnabled( menuItem.config );
		if ( ! siteId && ( ! isEnabled || ! menuItem.showOnAllMySites ) ) {
			return null;
		}

		let link;
		if ( ( ! isEnabled || ! menuItem.queryable ) && siteAdminUrl ) {
			link = siteAdminUrl + menuItem.wpAdminLink;
		} else {
			link = compact( [ menuItem.link, this.props.siteSlug ] ).join( '/' );
		}

		let preload;
		if ( includes( [ 'post', 'page' ], menuItem.name ) ) {
			preload = 'posts-pages';
		} else {
			preload = 'posts-custom';
		}

		let icon;
		switch ( menuItem.name ) {
			case 'post': icon = 'posts'; break;
			case 'page': icon = 'pages'; break;
			case 'jetpack-portfolio': icon = 'folder'; break;
			case 'jetpack-testimonial': icon = 'quote'; break;
			case 'media': icon = 'image'; break;
			default: icon = 'custom-post-type';
		}

		const className = this.props.itemLinkClass(
			menuItem.paths ? menuItem.paths : menuItem.link
		);

		return (
			<SidebarItem
				key={ menuItem.name }
				label={ menuItem.label }
				className={ className }
				link={ link }
				onNavigate={ this.onNavigate( menuItem.name ) }
				icon={ icon }
				preloadSectionName={ preload }
				postType={ menuItem.name }
			>
				{ menuItem.name === 'media' && (
					<MediaLibraryUploadButton className="sidebar__button" site={ site } href={ menuItem.buttonLink }>
						{ this.props.translate( 'Add' ) }
					</MediaLibraryUploadButton>
				) }
				{ menuItem.name !== 'media' && (
					<SidebarButton href={ menuItem.buttonLink } preloadSectionName="post-editor">
						{ this.props.translate( 'Add' ) }
					</SidebarButton>
				) }
			</SidebarItem>
		);
	}

	getCustomMenuItems() {
		const customPostTypes = omit( this.props.postTypes, [ 'post', 'page' ] );
		return reduce( customPostTypes, ( memo, postType, postTypeSlug ) => {
			// `show_ui` was added in Jetpack 4.5, so explicitly check false
			// value in case site on earlier version where property is omitted
			if ( false === postType.show_ui ) {
				return memo;
			}

			let buttonLink;
			if ( config.isEnabled( 'manage/custom-post-types' ) && postType.api_queryable ) {
				buttonLink = this.props.postTypeLinks[ postTypeSlug ];
			}

			return memo.concat( {
				name: postType.name,
				label: decodeEntities( get( postType.labels, 'menu_name', postType.label ) ),
				config: 'manage/custom-post-types',
				queryable: postType.api_queryable,

				// Required to build the menu item class name. Must be discernible from other
				// items' paths in the same section for item highlighting to work properly.
				link: '/types/' + postType.name,
				wpAdminLink: 'edit.php?post_type=' + postType.name,
				showOnAllMySites: false,
				buttonLink
			} );
		}, [] );
	}

	render() {
		if ( this.props.siteId && ! this.props.canUserEditPosts ) {
			return null;
		}

		const menuItems = [
			...this.getDefaultMenuItems(),
			...this.getCustomMenuItems()
		];

		return (
			<ul>
				{ this.props.siteId && (
					<QueryPostTypes siteId={ this.props.siteId } />
				) }
				{ menuItems.map( this.renderMenuItem, this ) }
			</ul>
		);
	}
}

export default connect( ( state, { siteId } ) => {
	const postTypes = getPostTypes( state, siteId );

	return {
		allSingleSites: areAllSitesSingleUser( state ),
		canUserEditPosts: canCurrentUser( state, siteId, 'edit_posts' ),
		isJetpack: isJetpackSite( state, siteId ),
		isSingleUser: isSingleUserSite( state, siteId ),
		postTypes,
		postTypeLinks: mapValues( postTypes, ( postType, postTypeSlug ) => {
			return getEditorPath( state, siteId, null, postTypeSlug );
		} ),
		siteAdminUrl: getSiteAdminUrl( state, siteId, ),
		site: getSite( state, siteId ),
		siteId,
		siteSlug: getSiteSlug( state, siteId ),
	};
} )( localize( PublishMenu ) );
