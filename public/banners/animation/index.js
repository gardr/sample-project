document.write('<style>\
            .background {\
                background-color: #2BACB5;\
                width : 100%;\
                height : 225px;\
            }\
            /* move the ball */\
            @-webkit-keyframes moveX {\
                  from { \
                      -webkit-transform: translateX(0);\
                  } to {\
                      -webkit-transform: translateX(100%);\
                  }\
            }\
            @-webkit-keyframes moveY {\
                from { \
                    -webkit-transform: translateY(0);\
                } to {\
                    -webkit-transform: translateY(125px);\
                }\
            }\
            @-moz-keyframes moveX {\
                  from { \
                      -moz-transform: translateX(0);\
                  } to {\
                      -moz-transform: translateX(100%);\
                  }\
            }\
            @-moz-keyframes moveY {\
                from { \
                      -moz-transform: translateY(0);\
                } to {\
                      -moz-transform: translateY(125px);\
                }\
            }\
            @-ms-keyframes moveX {\
                  from { \
                      -ms-transform: translateX(0);\
                  } to {\
                      -ms-transform: translateX(100%);\
                  }\
            }\
            @-ms-keyframes moveY {\
                from { \
                      -ms-transform: translateY(0);\
                } to {\
                      -ms-transform: translateY(125px);\
                }\
            }\
            @-o-keyframes moveX {\
                  from { \
                      -o-transform: translateX(0);\
                  } to {\
                      -o-transform: translateX(100%);\
                  }\
            }\
            @-o-keyframes moveY {\
                from { \
                      -o-transform: translateY(0);\
                } to {\
                      -o-transform: translateY(125px);\
                }\
            }\
            @keyframes moveX {\
                  from { \
                      transform: translateX(0);\
                  } to {\
                      transform: translateX(100%);\
                  }\
            }\
            @keyframes moveY {\
                from { \
                      transform: translateY(0);\
                } to {\
                      transform: translateY(125px);\
                }\
            }\
            .circle {\
                border-radius: 50%;\
                width: 100px;\
                height: 100px;\
                position: absolute;\
                background-color: rgb(150,29,28);\
            }\
            .moveX {\
            	margin-right: 100px;\
                -webkit-animation: moveX 5s linear 0s infinite alternate;\
                -moz-animation: moveX 5s linear 0s infinite alternate;\
                -ms-animation: moveX 5s linear 0s infinite alternate;\
                -o-animation: moveX 5s linear 0s infinite alternate;\
                animation: moveX 5s linear 0s infinite alternate;\
            }\
            .moveY {\
                -webkit-animation: moveY 2s linear 0s infinite alternate;\
                -moz-animation: moveY 2s linear 0s infinite alternate;\
                -ms-animation: moveY 2s linear 0s infinite alternate;\
                -o-animation: moveY 2s linear 0s infinite alternate;\
                animation: moveY 2s linear 0s infinite alternate;\
            }\
        </style>\
      <div class="background">\
          <div class="moveX"><span class="moveY circle"></span></div>\
      </div>');
