module.exports.getCSS = function(isResponsive){
    var wrappingCSS = [
        'object, embed, div, img, iframe { display: block; vertical-align: bottom; }',
        'body,html { overflow: hidden; background: transparent; display: inline; }',
        '#PASTIES {display: inline-block; vertical-align: bottom;}'
    ];

    var responsiveCSS = [
        'body, html, #PASTIES, div, iframe { display: block; vertical-align: bottom; }',
        'body, html, #PASTIES { background: transparent; width: 100%; height: 100%; overflow: hidden; }'
    ];

    return isResponsive ? responsiveCSS.join('') : wrappingCSS.join('');
};