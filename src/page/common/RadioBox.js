// Checkbox.js

'use strict';

import {Checkbox} from 'teaset';

export default class RadioBox extends Checkbox {
    buildProps() {
        super.buildProps();
        this.props.onPress = () => {
            let checked = !this.state.checked;
            if (checked) {
                this.setState({checked: checked});
                this.props.onChange && this.props.onChange(checked);
            }
        };
    }
}
