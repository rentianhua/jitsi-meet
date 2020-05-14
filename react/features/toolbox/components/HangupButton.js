// @flow

import _ from 'lodash';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { AbstractHangupButton } from '../../base/toolbox';
import type { AbstractButtonProps } from '../../base/toolbox';

/* Ater */
import { recordingController } from '../../local-recording/controller';
import {
    LocalRecordingInfoDialog
} from '../../local-recording/components';
import { openDialog } from '../../base/dialog';
import axios from 'axios';

/* Ater */


/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<Props, *> {
    _hangup: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    label = '挂断';
    tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._hangup = _.once(() => {
            sendAnalytics(createToolbarEvent('hangup'));

            // FIXME: these should be unified.
            if (navigator.product === 'ReactNative') {
                this.props.dispatch(appNavigate(undefined));
            } else {
                this.props.dispatch(disconnect(true));
            }
        });
    }

    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {
        /* Ater */
        if (recordingController.getLocalStats().isRecording) {
            /* Ater */
            this.props.dispatch(openDialog(LocalRecordingInfoDialog));
        } else {
            console.log(navigator.product)
            if (navigator.product !== 'ReactNative') {
                axios.post('https://test.lawbal.com/lvbao/conference/joinOrExist', {
                    roomNum: this.props._roomNumber,
                    conferenceId: window.location.pathname.substr(1),
                    status: '1',
                    userId: this.props._userId
                }).then(() => {

                })
            }
            this._hangup();
        }
    }
}

function _mapStateToProps(state) {
    return {
        _userId: state['features/base/conference'].userId,
        _roomNumber: state['features/base/conference'].roomNumber
    };
}


export default translate(connect(_mapStateToProps)(HangupButton));
