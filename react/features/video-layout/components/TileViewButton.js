// @flow

// import type { Dispatch } from 'redux';
import React, { Component } from 'react';
import {
    createToolbarEvent,
    sendAnalytics
} from '../../analytics';
// import { translate } from '../../base/i18n';
import { PictureMode, ListMode } from '../../base/icons';
import { connect } from '../../base/redux';
import { setTileView } from '../actions';
import logger from '../logger';
import { Icon } from '../../base/icons';

class TileViewButton extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const { _tileViewEnabled } = this.props;
        return (
            <div>
                {
                    _tileViewEnabled ? <Icon src = { ListMode } className= 'toggleListType' onClick={ this._handleClick } /> :
                        <Icon src = { PictureMode } className= 'toggleListType' onClick={ this._handleClick } />
                }
            </div>
        )
    }

    _handleClick = () => {
        const { _tileViewEnabled, dispatch } = this.props;

        sendAnalytics(createToolbarEvent(
            'tileview.button',
            {
                'is_enabled': _tileViewEnabled
            }));
        const value = !_tileViewEnabled;

        logger.debug(`Tile view ${value ? 'enable' : 'disable'}`);
        dispatch(setTileView(value));
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    // _isToggled() {
    //     return this.props._tileViewEnabled;
    // }
}

function _mapStateToProps(state) {
    return {
        _tileViewEnabled: state['features/video-layout'].tileViewEnabled
    };
}

export default connect(_mapStateToProps)(TileViewButton);
