var //gameboard
	playField = document.querySelector("#playField"),
    columns = 9,
    rows = 9,
    tr,
    td,
    fragment = document.createDocumentFragment(),
	losingScreen = document.getElementById("lost"),
    //arrow keys
	upKey = 38,
    downKey = 40,
    rightKey = 39,
    leftKey = 37,
	//snake
	snakeHead,
    startingPosition = ((rows - (rows % 2)) / 2) + "" + ((columns-(columns%2))/2),
    currentPosition,
	tailPosition,
	tail,
	//score
    apple,
    score,
	hasEaten = false,
	//speed
	speed = 300,
	slowSpeed = document.getElementById("slowSpeed"),
	normalSpeed = document.getElementById("normalSpeed"),
	fastSpeed = document.getElementById("fastSpeed"),
	scoreBoard = document.getElementById("score"),
	highScore = 0,
	highScoreBoard = document.getElementById("highScore"),
	//movement
 	movementLoop,
	lastKey;

slowSpeed.addEventListener("click", function(){speed = 500; slowSpeed.className="selected"; normalSpeed.removeAttribute("class", "selected"); fastSpeed.removeAttribute("class", "selected");})
normalSpeed.addEventListener("click", function(){speed = 300; normalSpeed.className="selected"; slowSpeed.removeAttribute("class", "selected"); fastSpeed.removeAttribute("class", "selected");})
fastSpeed.addEventListener("click", function(){speed = 150; fastSpeed.className="selected"; slowSpeed.removeAttribute("class", "selected"); normalSpeed.removeAttribute("class", "selected"); })

function randomTile(){
    return Math.floor(Math.random() * rows) + "" + Math.floor(Math.random() * columns);
}


function gameLost(){
	clearInterval(movementLoop);
	
	losingScreen.innerHTML = "<h3>GAME OVER</h3>";
	losingScreen.className = "show";
	var p = document.createElement("p");
	p.innerHTML = "Score: " + score;
	
	if(score > highScore){
		p.innerHTML += "<br><strong>New highscore!</strong>";
		highScore = score;
		highScoreBoard.innerHTML = "Highscore: " + highScore;
	}
	//p.innerHTML += "</p><p class='instructions'>Press any key to continue.";
	losingScreen.appendChild(p);
	document.onkeyup = function(event){
		gameStart();
	}
}

function gameStart(){
	losingScreen.className = "hide";
	losingScreen.innerHTML = "";
	lastKey = "";
	clearInterval(movementLoop); //stops movement
	//sets speed
	
	if(hasEaten){ //clears tail
		for(var i = 0; i < tail; i++){
			tailPosition[i].removeAttribute("class", "snakeBody");	
		}
	}
	//resets values
	hasEaten = false;
	score = 0;
	tail = 0;
	scoreBoard.innerHTML = "Score: " + score;
	tailPosition = [];
	snakeHead = snakeHead && snakeHead.removeAttribute("class", "snakeHead");
	//establish snake
snakeHead = document.getElementById(startingPosition);
snakeHead.setAttribute("class", "snakeHead");
currentPosition = startingPosition;

	apple = apple && apple.removeAttribute("class", "apple");
//establish points
apple = document.getElementById(randomTile());
while(apple.getAttribute("id") === currentPosition || apple.getAttribute("class") === "snakeHead"){ //makes sure that the apple doesn't appear
			apple = document.getElementById(randomTile());}																									  //where the snake currently is

apple.setAttribute("class", "apple");
	
document.onkeyup = function(event){
  
    clearInterval(movementLoop); //remove previous movement
   //MOVE UP
   if(event.keyCode === upKey) {
	   lastKey = "up";
       move(lastKey);
   }
   //MOVE DOWN
   else if(event.keyCode === downKey){
	   lastKey = "down";
	   move(lastKey);
   }
   //MOVE LEFT
   else if(event.keyCode === leftKey){
	   lastKey = "left";
	    move(lastKey);
   }
   //MOVE RIGHT
   else if(event.keyCode === rightKey){
	   lastKey = "right";
	    move(lastKey);
   }
	else{
		move(lastKey);
	}
};


}

function checkDirection(moveCondition, calculation){
	//only initiates if you're not hitting a wall
	
	if (moveCondition == true) {
		
		//create tail
		if(hasEaten){ //only initiates if an apple was eaten
			var newTail = []; //creates an array to move each value a step
			newTail[0] = document.getElementById(currentPosition); //gives the first place the current place of the head
			
				for(var i = 0; i < tail; i++){
					tailPosition[i].removeAttribute("class", "snakeBody"); //removes the old tail
					if(i > 0){newTail.push(tailPosition[i - 1]);}		   //inserts the rest of the values from the tail into the new one, never more than the score you currently have
				}
			
				tailPosition = newTail; //inserts the values of the new tail into the tail
			
				for(var j = 0; j < tail; j++){
					tailPosition[j].setAttribute("class", "snakeBody"); //gives each tail-id the class of the tail
				}
			}
		
         currentPosition = calculation; //uses the calculation to determine where the updated location should be
		 if(!hasEaten){snakeHead.removeAttribute("class", "snakeHead");} //if no apples have been eaten, remove the snakeHead-class from the previous tile
		
		 if(tailPosition.indexOf(document.getElementById(currentPosition)) != -1){
			gameLost();
		  }
		  
		 //picking up an apple
		 if(currentPosition === apple.getAttribute("id")){ //if you come across a tile with an apple
				if(speed > 300){score += 0.5;}			 							 //score increase at slow speed
				else if(speed > 200){score ++;}			 							 //score increase at normal speed
				else{score += 2;}			 							 			//score increase at fast speed
			 	tail++;											//tail size increases
			 	scoreBoard.innerHTML = "Score: " + score;
				hasEaten = true;								 //will make the tail
				tailPosition.unshift(document.getElementById(currentPosition)); //saves the position of the apple to the tail and places it first in the array
										
		 //make new apple
		        apple = document.getElementById(randomTile()); 
				while(apple.getAttribute("id") === currentPosition || apple.getAttribute("class") === "snakeHead" || apple.getAttribute("class") === "snakeBody"){ //makes sure that the apple doesn't appear
				apple = document.getElementById(randomTile());}																									  //where the snake currently is
				apple.setAttribute("class", "apple");
               	}
				
           snakeHead = document.getElementById(currentPosition); //sets the new location of the snakeHead
           snakeHead.setAttribute("class", "snakeHead"); // gives the snakeHead its class
           
       	}
	//if you hit the edge
	else{
		gameLost();
	}

}

function move(key){
	if(key == "up"){
		movementLoop = setInterval(function(){
		   			  checkDirection((parseInt(currentPosition[0]) > 0), 
					  ((parseInt(currentPosition[0]) - 1) + "" + parseInt(currentPosition[1])))},
					  speed);
	}
	else if( key == "down"){
		movementLoop = setInterval(function(){
       				 checkDirection((parseInt(currentPosition[0]) < (rows - 1)),
					 ((parseInt(currentPosition[0]) + 1) + "" + parseInt(currentPosition[1])))},
					 speed);
		}
	else if(key == "left"){
	   movementLoop = setInterval(function(){
		   			  checkDirection((parseInt(currentPosition[1]) > 0),
					  (parseInt(currentPosition[0]) + "" + (parseInt(currentPosition[1]) - 1)))},
					  speed);
		}
	else if(key == "right"){
		movementLoop = setInterval(function (){
	  					checkDirection(((parseInt(currentPosition[1]) < (columns - 1))),
						(parseInt(currentPosition[0]) + "" + (parseInt(currentPosition[1]) + 1)))},
						speed);
		}	
}


//create playing field, assign id to every td
for(var i = 0; i < rows; i++){
    tr = document.createElement("tr");
    for(var j = 0; j < columns; j++){
        td = document.createElement("td");
        td.setAttribute("id", i + "" + j);
        tr.appendChild(td);
    }
    fragment.appendChild(tr);
}
playField.appendChild(fragment);

gameStart();
