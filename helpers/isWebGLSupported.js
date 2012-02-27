/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */

function isWebGLSupported() {
    //https://github.com/jeromeetienne/threejsboilerplate/blob/master/vendor/three.js/Detector.js
    return ( function () { 
            try { 
                return !! window.WebGLRenderingContext 
                    && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
            } catch( e ) { 
                return false; 
            }} )();
    /*
    // Adapted from http://doesmybrowsersupportwebgl.com/
    var cvs = document.createElement('canvas');
    if ( navigator.userAgent.indexOf("MSIE") >= 0 )
        try { 
            WebGLHelper.CreateGLContext(cvs, 'canvas');
            return true;
        }catch(e){ return false;}
    
    return (["webgl","experimental-webgl","moz-webgl","webkit-3d"].some(function(el){
        try{ 
            cvs.getContext(el);
            return true;
        }catch(e){ return false;}
    })); */
}
