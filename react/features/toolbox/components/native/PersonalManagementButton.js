// @flow

import { translate } from '../../../base/i18n';
import { PersonnelManagement } from '../../../base/icons';
import { MEDIA_TYPE } from '../../../base/media';
import { connect } from '../../../base/redux';
import { AbstractButton } from '../../../base/toolbox';
import type { AbstractButtonProps } from '../../../base/toolbox';
import { isLocalTrackMuted } from '../../../base/tracks';
import io from 'socket.io-client';

/**
 * The type of the React {@code Component} props of {@link ToggleCameraButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether the current conference is in audio only mode or not.
     */
    _audioOnly: boolean,

    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * An implementation of a button for toggling the camera facing mode.
 */
class PersonalManagementButton extends AbstractButton<Props, *> {
    accessibilityLabel = '人员管理';
    icon = PersonnelManagement;
    label = '人员管理';
    socket = null;

    componentDidMount() {
        this.socket = this.props._isProd ? io('ws://t.lawbal.com:8881') : io('ws://t.lawbal.com:8882');
    }

    _handleClick() {
        console.log(this.props._userId)
        this.socket.emit('connect', {
            to: this.props._userId,
            msg: {}
        })
        console.log('点击人员管理')
    }
}

function _mapStateToProps(state): Object {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const tracks = state['features/base/tracks'];

    return {
        _audioOnly: Boolean(audioOnly),
        _videoMuted: isLocalTrackMuted(tracks, MEDIA_TYPE.VIDEO),
        _isProd: state['features/base/conference'].isProd,
        _userId: state['features/base/conference'].userId
    };
}

export default translate(connect(_mapStateToProps)(PersonalManagementButton));
