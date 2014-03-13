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
              		-moz-transform: translateX(0);\
              		-ms-transform: translateX(0);\
              		-o-transform: translateX(0);\
              		transform: translateX(0);\
      			} to {\
      				-webkit-transform: translateX(100%);\
              		-moz-transform: translateX(100%);\
              		-ms-transform: translateX(100%);\
              		-o-transform: translateX(100%);\
              		transform: translateX(100%);\
  				}\
            }\
            @-webkit-keyframes moveY {\
                from { \
                	-webkit-transform: translateY(0);\
              		-moz-transform: translateY(0);\
              		-ms-transform: translateY(0);\
              		-o-transform: translateY(0);\
              		transform: translateY(0);\
            	} to {\
            		-webkit-transform: translateY(125px);\
              		-moz-transform: translateY(125px);\
              		-ms-transform: translateY(125px);\
              		-o-transform: translateY(125px);\
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
                -o-animation: moveX 5s linear 0s infinite alternate;\
                animation: moveX 5s linear 0s infinite alternate;\
            }\
            .moveY {\
                -webkit-animation: moveY 2s linear 0s infinite alternate;\
                -moz-animation: moveY 2s linear 0s infinite alternate;\
                -o-animation: moveY 2s linear 0s infinite alternate;\
                animation: moveY 2s linear 0s infinite alternate;\
            }\
        </style>\
      <div class="background">\
          <div class="moveX"><span class="moveY circle"></span></div>\
      </div>');