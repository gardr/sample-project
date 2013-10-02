var Cookies = require('cookies-js');


function getCookies() {
    var userarea = Cookies.get('USERAREA') || Cookies.get('userarea');

    return {
        kvuserid: Cookies.get('USERID') || Cookies.get('userid'),
        kvuserareaid: userarea && userarea.split('X')[2]
    };
}

module.exports = {
    getCookies: getCookies
};
