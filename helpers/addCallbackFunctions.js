/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("addCallbackFunctions.js");

var maze = maze || {};
maze.helpers = maze.helpers || {};

maze.helpers.addCallbackFunctions = function(obj){
    obj.callbacks = {};
    obj.addCallback = function(callbackName,callbackFunction){
        obj.callbacks[callbackName] = obj.callbacks[callbackName] || [];
        if( obj.callbacks[callbackName].indexOf(callbackFunction)==-1)
            obj.callbacks[callbackName].push(callbackFunction);
    };
    obj.notify = function(callbackName){
        var i
        , ar = obj.callbacks[callbackName]
        , args = Array.prototype.slice.call(arguments,1);
        if( ar )
            ar.forEach(function(el){
                el.apply(null,args);
            });
    };
};