import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'react-input-range/lib/css/index.css';
import InputRange from 'react-input-range';
import { Combobox } from 'react-input-enhancements';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';

import ko from 'terriajs-cesium/Source/ThirdParty/knockout';

import ObserveModelMixin from '../ObserveModelMixin';

import Styles from './crime-window.scss';

const SLIDE_DURATION = 300;

const CrimeWindow = createReactClass({
    displayName: 'CrimeWindow',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        crimeState: PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            isMounted: false,
            years: {
                min: 5,
                max: 10,
            },
            modelNames: ['Model 1', 'Uni 2', 'China', 'Regression', 'Bali', 'Cheese'],
            value: 'value--Model 1',
        };
    },

    close() {
        this.props.crimeState.crimePanelIsVisible = false;
        this.props.viewState.switchMobileView('nowViewing');
    },

    handleChange: function (event) {
        this.setState({
            text: event.target.value
        });
    },

    onChange() {

    },

    componentWillMount() {
        this.props.crimeState.crimePanelAnimating = true;

        this._pickedFeaturesSubscription = ko.pureComputed(this.isVisible, this).subscribe(this.onVisibilityChange);
        this.onVisibilityChange(this.isVisible());
    },

    componentDidMount() {
        this.escKeyListener = e => {
            if (e.keyCode === 27) {
                this.close();
            }
        };
        window.addEventListener('keydown', this.escKeyListener, true);
    },

    onVisibilityChange(isVisible) {
        if (isVisible) {
            this.slideIn();
        } else {
            this.slideOut();
        }
    },

    slideIn() {
        this.props.crimeState.crimePanelAnimating = true;

        this.setState({
            visible: true
        });
        setTimeout(() => {
            this.setState({
                slidIn: true
            });

            setTimeout(() => this.props.crimeState.crimePanelAnimating = false, SLIDE_DURATION);
        });
    },

    slideOut() {
        this.setState({
            slidIn: false
        });
        setTimeout(() => {
            this.setState({
                visible: false
            });
        }, SLIDE_DURATION);
    },

    componentWillUnmount() {
        window.removeEventListener('keydown', this.escKeyListener, false);

        this._pickedFeaturesSubscription.dispose();
    },

    isVisible() {
        // return !this.props.viewState.useSmallScreenInterface && !this.props.viewState.hideMapUi() && this.props.viewState.explorerPanelIsVisible;
        return this.props.crimeState.crimePanelIsVisible;
    },

    render() {
        const visible = this.state.visible;
        const modelNames = this.state.modelNames;
        const value = this.state.value;

        return visible ? (
            <div className={Styles.modalWrapper}
                 id="explorer-panel-wrapper"
                 aria-hidden={!visible}>
                <div onClick={this.close}
                     id="modal-overlay"
                     className={Styles.modalOverlay}
                     tabIndex="-1"/>
                <div id="crime-panel"
                     className={classNames(Styles.crimePanel, Styles.modalContent, {[Styles.isMounted]: this.state.slidIn})}
                     aria-labelledby="modalTitle"
                     aria-describedby="modalDescription"
                     role="dialog">

                    <InputRange
                        maxValue={20}
                        minValue={0}
                        value={this.state.years}
                        draggableTrack={true}
                        disabled={false}
                        onChange={value => this.setState({years: value})}/>

                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={3}>
                            Models:
                        </Col>
                        <Col xs={6}>
                            <Combobox
                                value={value}
                                options={modelNames}
                                onSelect={this.onChange}
                                autosize
                            >
                                {inputProps =>
                                    <FormControl
                                        {...inputProps}
                                        type='text'
                                        placeholder='No Model'
                                    />
                                }
                            </Combobox>
                        </Col>
                    </FormGroup>

                    <button type='button'
                            onClick={this.close}
                            className={Styles.btnCloseModal}
                            title="Close data panel"
                            data-target="close-modal">
                        Done
                    </button>
                </div>
            </div>
        ) : null;
    },
});

module.exports = CrimeWindow;
