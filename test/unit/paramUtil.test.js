/* jshint maxlen: 99999 */
var paramUtil = require('../../src/lib/paramUtil.js');

describe('paramUtil', function() {

    it('deparam', function(){
        expect(paramUtil.deparam('a=a&b=b&c=c&amp;d=d;e=e')).toEqual({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e'});
        //expect(paramUtil.deparam('a=a&b=b&c=c&amp;d=d;e=e'), /;/gmi).toEqual({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e'});
        expect(paramUtil.deparam('a=æ')).toEqual({a: 'æ'});
        expect(paramUtil.deparam('a=%C3%A6')).toEqual({a: 'æ'});
        //expect(paramUtil.deparam('a=%E6')).toEqual({a: 'æ'});

        var complex = 'url=http://helios.finn.no/addyn|3.0|989.1|3077328|0|1013|ADTECH;cookie=info;loc=100;target=_blank;alias=frontpage/survey;key=+B09809_10001+B09809_10447+B09809_11086+B09809_11104+B09809_10870+B09809_11117+C11162_10197+C11162_10196+C11162_10194+C11162_10189;grp=106942228;kvuserid=1069558077;kvuserareaid=20002;randnum=8;;page=frontpage;misc=523577442023055;kvuserid=_1377027414670&width=123&height=321';
        expect(paramUtil.deparam(complex, /&/g))
            .toEqual({
                url: 'http://helios.finn.no/addyn|3.0|989.1|3077328|0|1013|ADTECH;cookie=info;loc=100;target=_blank;alias=frontpage/survey;key=+B09809_10001+B09809_10447+B09809_11086+B09809_11104+B09809_10870+B09809_11117+C11162_10197+C11162_10196+C11162_10194+C11162_10189;grp=106942228;kvuserid=1069558077;kvuserareaid=20002;randnum=8;;page=frontpage;misc=523577442023055;kvuserid=_1377027414670',
                width: '123',
                height: '321'
            });
    });

    it('param', function(){
        expect(paramUtil.param({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e'})).toEqual('a=a&b=b&c=c&d=d&e=e');
        expect(paramUtil.param({a: 'a'})).toEqual('a=a');
        expect(paramUtil.param({a: 'æ'})).toEqual('a=%C3%A6');
    });

});