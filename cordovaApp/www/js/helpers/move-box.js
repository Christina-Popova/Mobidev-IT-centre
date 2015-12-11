define([], function () {

	var moveBox = function (box, parents) {
		var posX = box.position().left;
		var posY = box.position().top;
		var flag = false;
		var coordEnterX;
		var coordEnterY;

		var maxLeft = parents.width() - box.width();
		var maxTop = parents.height() - box.height();

		box.mousedown(function(e){
			coordEnterX = parseInt(e.pageX);
			coordEnterY = parseInt(e.pageY);
			flag = true;
		}).mouseup(function(){
			flag = false;
		});

		$(document).mousemove(function(e){
			if (flag){
				var difX = parseInt(e.pageX) - coordEnterX;
				var difY = parseInt(e.pageY) - coordEnterY;

				if(posX + difX > maxLeft){
					box.css({'left':maxLeft})
				} else if(posX + difX < 0){
					box.css({'left':0})
				} else{
					box.css({'left':posX + difX})
				}

				if(posY + difY > maxTop){
					box.css({'top':maxTop})
				} else if(posY + difY < 0){
					box.css({'top':0})
				} else{
					box.css({'top':posY + difY})
				}
			}
		}).mouseup(function(){
			flag = false;
			posX = box.position().left;
			posY = box.position().top;
		});
	};

	return moveBox;
});














