import addedByUser from '../Core/addedByUser';
import clone from 'terriajs-cesium/Source/Core/clone';
import defined from 'terriajs-cesium/Source/Core/defined';
import DisclaimerHandler from './DisclaimerHandler';
import knockout from 'terriajs-cesium/Source/ThirdParty/knockout';
import MouseCoords from './MouseCoords';

/**
 * Root of a global view model. Presumably this should get nested as more stuff goes into it. Basically this belongs to
 * the root of the UI and then it can choose to pass either the whole thing or parts down as props to its children.
 */

export default class CrimeState {
    constructor(options) {
        const terria = options.terria;

        this.terria = terria;
        this.crimePanelIsVisible = false;
        this.crimePanelAnimating = false;

        knockout.track(this, [
            'crimePanelIsVisible',
            'crimePanelAnimating'
        ]);
    }

    openCrimePanel() {
        this.crimePanelIsVisible = true;
        this.modalTabIndex = 0;
    }
}
