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
function uncheckMultSel()
{
	var sels = document.getElementsByTagName("select");
    for(var i=0; i<sels.length; i++)
    {
    	var elem = sels[i];
    	if(elem.attributes['multiple']=='undefined')
    	{
    		continue;
    	}
    	else
    	{
    		for(var j=0; j<elem.length; j++)
    		{
    			elem.options[j].selected=false;
    		}
    	}
    }
}
function runScript() 
{
	//uncheck boxes, this handles the case when the 
	//script is ran more than one time without page reload
	uncheckCheckboxes();

	//unselect multiple selects, this handles the case when the 
	//script is ran more than one time without page reload
	uncheckMultSel();

    console.log('working script yo');

    //take care of input fields
    var inputs = document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++)
    {
    	var elem = inputs[i];
    	var eType = elem.type.toLowerCase();

    	if(eType=="radio")
    	{
    		//get all the associated radio buttons
    		var subInputs = document.getElementsByName(elem.name);

    		//pick a random radio button
    		var subOption = Math.floor(randInc(0,subInputs.length-1));

    		//select the radio button
    		subInputs[subOption].checked=true;
    	}
    	else if(eType=="checkbox")
    	{
    		//35% of time check box
    		//65% of time dont check box
    		var ranN = Math.floor();
    		if(randInc(1,100)<=35)
    		{
    			elem.checked = true;
    		}
    	}
    	else if(eType=="hidden" || eType=="submit" || eType=="button" || eType=="reset")
    	{
    		//no need to touch hidden types
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
    		//console.log(elem.name+": stirng: "+outStr);
    		//console.log("else input: "+elem.name);
    		elem.value=outStr;
    	}
    	//console.log(elem.name);
    }

    //take care of select fields
    var sels = document.getElementsByTagName("select");
    for(var i=0; i<sels.length; i++)
    {
    	var elem = sels[i];
    	if(elem.attributes['multiple']=='undefined')
    	{
    		var opt = Math.floor(randInc(0,elem.length-1));
    		elem.options[opt].selected=true;
    	}
    	else
    	{
    		//the selectNum is supposed to represent number of
    		//selected options in a 'multiple' select but the loop
    		//below might not always produce this amount of options
    		//because the same option might be randomly selected more
    		//than one time, but this is not much of a concern anyway
    		//becuase it adds to the randomness
    		var selectNum = Math.floor(randInc(1,elem.length-1));

    		for(var j=0; j<selectNum; j++)
    		{
    			var opt = Math.floor(randInc(0,elem.length-1));
    			elem.options[opt].selected=true;
    		}
    	}
    }
    var tarea = document.getElementsByTagName("textarea");
    for(var i=0; i<tarea.length; i++)
    {
    	
    	var elem = tarea[i];

    	var maxL = elem.maxLength;

    	var sent = new Array();
    	sent[0]='The totalization of the gaze allegorizes the authentication of power.';
    	sent[1]='Pootwattle\'s carefully researched summary of the relationship between the totalization of the gaze and the authentication of power is exceptionally resistant to summary, as befits its project.';
    	sent[2]='The socialization of the eclectic is connected to the illusion of narrative sequence.';
    	sent[3]='The imposition of millennial hedonism can easily be made compatible with the reinscription of difference.';
    	sent[4]='Lorem ipsum is the bomb yo!';
    	sent[5]='The sublimation of exchange value should suggest the logic of a radical alterity.';
    	
    	//unlimited number of sentences
    	var strOut = sent[4];
    	if(maxL==-1 || maxL>100)
    	{
    		strOut="";
    		var numSen = Math.floor(randInc(1,6));
    		for(var j=0; j<numSen; j++)
    		{
    			var randSen = Math.floor(randInc(0,5));
    			strOut += sent[randSen]+" ";
    		}
    	}
    	
    	elem.value=strOut;
    	
    }
}
runScript();