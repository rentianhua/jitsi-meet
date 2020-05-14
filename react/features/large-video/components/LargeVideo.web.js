// @flow

import React, { Component } from 'react';

import { Watermarks } from '../../base/react';
import { Captions } from '../../subtitles/';
import { connect } from '../../base/redux';
import axios from 'axios';
import { message } from 'antd';
import { SaveOutlined, EditOutlined } from '@ant-design/icons';
import 'antd/es/message/style/css';
declare var interfaceConfig: Object;

type Props = {

    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    _noAutoPlayVideo: boolean
}

/**
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * the conference participant who is on the local stage) on Web/React.
 *
 * @extends Component
 */

class LargeVideo extends Component<Props> {
    state = {
        isEdit: false,
        roomNum: '',
        realMeetTitle: '',
        meetTitle: ''
    }

    componentDidMount() {
        axios.post('https://test.lawbal.com/lvbao/conference/info/' + window.location.pathname.substr(1), {}).then((res) => {
            if (res.data.code === 0) {
                this.setState({
                    roomNum: res.data.info.roomNum,
                    realMeetTitle: res.data.info.conferenceTitle,
                    meetTitle: res.data.info.conferenceTitle
                })
            }
        })
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const { isEdit, roomNum, meetTitle, realMeetTitle } = this.state;
        return (
            <div
                className = 'videocontainer'
                id = 'largeVideoContainer'>
                {/*<div id = 'sharedVideo'>*/}
                    {/*<div id = 'sharedVideoIFrame' />*/}
                {/*</div>*/}
                <div id = 'etherpad' />

                <Watermarks />

                <div id = 'dominantSpeaker'>
                    <div className = 'meet-title'>
                        <div className = 'meet-title-text'>
                            { isEdit ? (
                                    <div className = 'title-input'>
                                        <input type = 'text' value={ meetTitle } ref={i => this.titleInput = i} onInput={ this.handleInputChange } />
                                        <span></span>
                                    </div>
                                ) : <span className = 'title-text'>{ realMeetTitle }</span>
                            }
                            { isEdit ? <SaveOutlined style = {{ cursor: 'pointer', outline: 'none' }} onClick={ () => this.handleEdit('save') } /> :
                                <EditOutlined style = {{ cursor: 'pointer', outline: 'none' }} onClick={ () => this.handleEdit('edit') } /> }
                        </div>
                        <p>(房间号: { roomNum })</p>
                    </div>
                    <div className = 'dynamic-shadow' />
                    <div id = 'dominantSpeakerAvatarContainer' />
                </div>
                <div id = 'remotePresenceMessage' />
                <span id = 'remoteConnectionMessage' />
                <div id = 'largeVideoElementsContainer'>
                    <div id = 'largeVideoBackgroundContainer' />

                    {/*
                      * FIXME: the architecture of elements related to the large
                      * video and the naming. The background is not part of
                      * largeVideoWrapper because we are controlling the size of
                      * the video through largeVideoWrapper. That's why we need
                      * another container for the background and the
                      * largeVideoWrapper in order to hide/show them.
                      */}
                    <div id = 'largeVideoWrapper'>
                        <video
                            autoPlay = { !this.props._noAutoPlayVideo }
                            id = 'largeVideo'
                            muted = { true } />
                    </div>
                </div>
                { interfaceConfig.DISABLE_TRANSCRIPTION_SUBTITLES
                    || <Captions /> }
            </div>
        );
    }

    handleInputChange = (e) => {
        this.setState({
            meetTitle: e.target.value,
        });
    }

    handleEdit = (action) => {
        if (action === 'edit') {
            this.setState({
                isEdit: true
            }, () => {
                this.titleInput.focus()
            })
        } else {
            axios.post('https://test.lawbal.com/lvbao/conference/generate', {
                conferenceId: window.location.pathname.substr(1),
                conferenceTitle: this.state.meetTitle,
                meetingFlag: true
            }).then((res) => {
                if (res.data.code === 0) {
                    this.setState({
                        realMeetTitle: this.state.meetTitle
                    });
                    message.success('修改成功', 2);
                } else {
                    this.setState({
                        meetTitle: this.state.realMeetTitle
                    });
                    message.error('修改失败', 2);
                }
            }).catch(() => {
                this.setState({
                    meetTitle: this.state.realMeetTitle
                });
                message.error('修改失败', 2);
            });
            this.setState({
                isEdit: false
            });
        }
    }
}


/**
 * Maps (parts of) the Redux state to the associated LargeVideo props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _noAutoPlayVideo: boolean
 * }}
 */
function _mapStateToProps(state) {
    const testingConfig = state['features/base/config'].testing;

    return {
        _noAutoPlayVideo: testingConfig?.noAutoPlayVideo
    };
}


export default connect(_mapStateToProps)(LargeVideo);
