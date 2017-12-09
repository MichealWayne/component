// scaner
import { removeSpaceAndLinebreak } from './utils'

export default class Scaner {
    constructor () {
        this.index = 0;
        this.status = 'off';
    }
    // end of scan
    end (callback) {
        this.index = 0;
        this.status = 'off';

        if (callback) callback();
    }
    // css scan
    // @param {Object} config:
    //        {Functon} handleStyle: selector and content function;
    //        {Function} callback: callback
    doCssScan (config) {
        let THIS = this;
        let result = {
            selector: '',
            content: ''
        };

        let cssdata = removeSpaceAndLinebreak(config.data),
            _length = cssdata.length;

        THIS.status = 'selector';
        for (THIS.index = 0; THIS.index < _length; THIS.index++) {
            let _data = cssdata[THIS.index],
                _status = THIS.status;

            if (_data === '{' && !~cssdata.slice(THIS.index - 1, THIS.index + 2).indexOf('{{') || 
                _data === '}' && (THIS.index === _length - 1 || !~cssdata.slice(THIS.index - 1, THIS.index + 2).indexOf('}}'))) {
                THIS.status = _status === 'selector' ? 'content' : 'selector';
            } else if (!(!result[THIS.status] && _data == ' ')) result[THIS.status] += cssdata[THIS.index];

            if (THIS.status !== _status && _status === 'content') {
                if (config.handleStyle) config.handleStyle(result);

                result.selector = '';
                result.content = '';
            }
        }

        THIS.end(config.callback);
    }
}