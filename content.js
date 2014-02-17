function rand(min, max) {
	return Math.random() * (max - min) + min;
}
//random inclusive range
function randInc(min, max) {
	return Math.random() * ( (max - min)+1 ) + min;
}
function getCharCode(slot)
{
	switch(slot)
	{
	case 0:
		return Math.floor(randInc(97,122));
		break;
	case 1:
		return Math.floor(randInc(65,90));
		break;
	case 2:
		return Math.floor(randInc(48,57));
		break;
	case 3:
		return 32;
		break;
	case 4:
		return Math.floor(randInc(33,47));
		break;
	case 5:
		return Math.floor(randInc(58,64));
		break;
	case 6:
		return Math.floor(randInc(91,96));
		break;
	case 7:
		return Math.floor(randInc(123,126));
		break;
	default:
		return Math.floor(randInc(32,126));
		break;
	}
}
function getBiasedChar()
{
	/*var rand = function(min, max) {
		return Math.random() * (max - min) + min;
	};*/
	//0- [40%] lower case letters ascii 97-122
	//1- [39%] upper case letters ascii 65-90
	//2- [8%] numbers ascii 48-57
	//3- [5%] space ascii 32
	//4- [2%] section before numbers ascii 33-47
	//5- [2%] section after numbers ascii 58-64
	//6- [2%] section after upper case letters ascii 91-96
	//7- [2%] section after lower case letters ascii 123-126 
	var weights = [0.40,0.39,0.08,0.06,0.02,0.02,0.02,0.02];

	//used in calculating random number
	var total_weight=1.00;

	//random number used to pick section
	var random_num = rand(0,total_weight);

	//var used to determine the slot in which the random number
	//falls (main player in picking the slot)
	var weight_sum = 0.00;

	var charSel = -1;

	for(var i=0; i<weights.length; i++)
	{
		weight_sum += weights[i];

		if(random_num<=weight_sum)
		{
			charSel=i;
			break;
		}
	}
	return String.fromCharCode(getCharCode(charSel));
}
function uncheckCheckboxes()
{
	var inputs = document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++)
    {
    	if(inputs[i].type.toLowerCase() == "checkbox")
    	{
    		inputs[i].checked=false;
    	}
    }
}
function runScript() 
{
	//uncheck boxes, this handles the case when the 
	//script is ran more than one time without page reload
	uncheckCheckboxes();

    console.log('working script yo');
    //console.log(document.getElementsByTagName("input"));
    var inputs = document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++)
    {
    	var elem = inputs[i];

    	if(elem.type.toLowerCase()=="radio")
    	{
    		var subInputs = document.getElementsByName(elem.name);
    		console.log(subInputs);
    		var subOption = Math.floor(randInc(0,subInputs.length-1));
    		console.log(subOption);

    		subInputs[subOption].checked=true;

    		console.log("we have "+subInputs.length+" radio options");
    	}
    	else if(elem.type.toLowerCase()=="checkbox")
    	{
    		//35% of time check box
    		//65% of time dont check box
    		var ranN = Math.floor();
    		if(randInc(1,100)<=35)
    		{
    			elem.checked = true;
    		}
    	}
    	else if(elem.type.toLowerCase()=="hidden")
    	{
    		continue;
    	}
    	else //should be just regular input textbox
    	{

    		var maxL = elem.maxLength;
    		if(maxL >100)
    		{
    			maxL=100;
    		}
    		var numC = Math.floor(randInc(2,maxL));
    		var outStr = "";
    		//console.log("numCharacters["+maxL+"]:"+elem.name+" random num:"+numC);
    		for(var j=0; j<numC; j++)
    		{
    			//get a biased char
    			outStr += getBiasedChar();
    		}
    		console.log(elem.name+": stirng: "+outStr);
    		//console.log("else input: "+elem.name);
    		elem.value=outStr;
    	}
    	//console.log(elem.name);
    }
}
runScript();