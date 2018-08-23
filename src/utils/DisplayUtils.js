/**
 * Created by heaton on 2017/12/21.
 * Desription :
 */

'use strict';

import {
    Dimensions,
    PixelRatio
} from 'react-native';

class DisplayUtils{
    SCREEN = Dimensions.get('window');
    px2dp(px){
        // let dp = px*(1/PixelRatio.get());
        // return Math.floor(dp * 10) / 10;
        return px/PixelRatio.get();
    }
    MIN_LINE_HEIGHT = 1/PixelRatio.get();
}
const Instance = new DisplayUtils()
export default Instance;