/*jshint browser: true, node: true*/
/*global prepros */

prepros.factory('notification', function (config) {

    'use strict';

    //Push log to global so it can be viewed from another window
    global.preprosLog = [];

    var notificationWindow;

	function error(name, details){

        global.preprosLog.unshift({name: name, details: details, type: 'error', date: new Date().toISOString()});

        global.preprosNotification = {name: name, details: details, type: 'error'};

        //Hack to update log
        if(global.logScope){
            global.logScope.$apply();
        }

        if(config.user.enableNotifications){

            if(typeof(notificationWindow) === 'object') {
                notificationWindow.reload();
                notificationWindow.show();

            } else {

                notificationWindow = require('nw.gui').Window.open("file:///" + config.basePath + '\\html\\notification.html', {
                    x: window.screen.availWidth-400,
                    y: window.screen.availHeight-70,
                    width: 400,
                    height: 70,
                    frame: false,
                    toolbar: false,
                    resizable: false,
                    show: false,
                    show_in_taskbar: false
                });

                notificationWindow.on('close', function(){
                    this.close(true);
                    notificationWindow = undefined;
                });
            }

            //Close notification window when main window is closed
            require('nw.gui').Window.get().on('close', function () {

                if(typeof(notificationWindow) === 'object') {
                    notificationWindow.close();
                }
            });
        }
	}

    return {
		error: error
    };

});
