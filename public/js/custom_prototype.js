jQuery.fn.fadeOutAndRemove = function(speed){
  $(this).fadeOut(speed,function(){
    $(this).remove();
  })
};