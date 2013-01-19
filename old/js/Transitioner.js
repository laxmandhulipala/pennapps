var Transitioner = function(){
    
}

Transitioner.prototype.slideRight = function(oldLeft, oldCenter){
    oldLeft.removeClass('transition');
    oldLeft.addClass('left');
    setTimeout(function(){
            oldCenter.addClass('transition');
            oldCenter.removeClass('center');
            oldCenter.addClass('right');
            oldLeft.removeClass('left');
            oldLeft.addClass('center');
            oldLeft.addClass('transition');
        }, 500);
}

Transitioner.prototype.slideLeft = function(oldCenter, oldRight){
    oldRight.removeClass("transition");
    oldRight.addClass('right');
    setTimeout(function(){
            oldCenter.addClass('transition');
            oldCenter.removeClass('center');
            oldCenter.addClass('left');
            oldRight.removeClass('right');
            oldRight.addClass('center');
            oldRight.addClass('transition');
        }, 500);
}

