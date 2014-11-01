/**
 * Content script that gets executed upon key press of the
 * Random Filler icon. Majority of the extension logic lies here.
 * 
 * @author Pawel Szczurko
 */

/**
 * Return a random number in the specified range
 * @param min Start of range
 * @param max End of range
 * @returns Random number in the range
 */
function rand(min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * Return a random number in the inclusive range
 * @param min Start of range
 * @param max End of range
 * @returns Random number in the inclusive range
 */
function rand_inc(min, max) {
	return Math.random() * ( (max - min)+1 ) + min;
}

/**
 * Get a random ASCII character code based on the sections as follows
 *     0- lower case letters ascii 97-122
 *     1- upper case letters ascii 65-90
 *     2- numbers ascii 48-57
 *     3- space ascii 32
 *     4- section before numbers ascii 33-47
 *     5- section after numbers ascii 58-64
 *     6- section after upper case letters ascii 91-96
 *     7- section after lower case letters ascii 123-126 
 *     
 * @param slot One of the specified slots
 * @returns Random ASCII character code
 */
function get_char_code(slot)
{
	switch(slot)
	{
	case 0:
		return Math.floor(rand_inc(97,122));
		break;
	case 1:
		return Math.floor(rand_inc(65,90));
		break;
	case 2:
		return Math.floor(rand_inc(48,57));
		break;
	case 3:
		return 32;
		break;
	case 4:
		return Math.floor(rand_inc(33,47));
		break;
	case 5:
		return Math.floor(rand_inc(58,64));
		break;
	case 6:
		return Math.floor(rand_inc(91,96));
		break;
	case 7:
		return Math.floor(rand_inc(123,126));
		break;
	default:
		return Math.floor(rand_inc(32,126));
		break;
	}
}

/**
 * Get a biased ASCII character code 
 * @param slot One of the specified slots
 * @returns Biased ASCII character code
 */
function get_biased_char()
{
    // Probability of each ASCII slot
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
	return String.fromCharCode(get_char_code(charSel));
}

/**
 * Deselect all checkboxes found.
 */
function uncheck_checkboxes()
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

/**
 * Deselect all multiselect dropdowns.
 */
function uncheck_multsel()
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

/**
 * Get a test case
 * @param caseNum Number of test case to return, if out of the bounds
 *        of the array, a random case will be returned
 * @returns A test case
 */
function get_test_case(caseNum) {
    var cases = [
        ["Pawel", "Szczukowski", "8 Plum Road", "East Brunswick", 
        "New Jersey", "06999", "pawel@pawel.pw", "666-999-9999"],
        ["Robert", "O'Donnel", "56 Jackson Road", "East Orange", 
        "New Jersey", "09951", "rob.donn5_7+hey@greatdomain.com", "567-456-7898"],
        ["Ari", "DeVitale", "11123 46 Street", "New York", 
        "New York", "07067", "aDeViT4=e@exam.me", "5554443333"],
        ["Ji", "Bank-Jones", "40-30 134th St.", "New Brunswick",
        "Kentucky", "07851", "OnlyJILetters@test.hi", "567 789 0987"],
        ["Frederick", "Rogers Matos", "61 Park Hill Terrace", "Hamilton Square", 
        "Utah", "19956", "numbers34_5lett@ebolaisnear.me", "1 345 234 1234"],
        ["Joe", "Rogers O'Brian", "3414 Sweet Gum Avenue", "Lakeville", 
        "Pennsylvania", "67731", "what@is.anemail.edu", "444 234 5678"],
        ["Tom", "Graczkowski", "200 Highway 35", "Potomoca", 
        "Maryland", "20706", "rdgd@shorts.edu", "456-876-4567"],
        ["Janusz", "Nowak", "566 W 133 Street", "Tucson", 
        "Arizona", "85739", "email@email.com", "345 123 1234"]
    ];

    if (caseNum < 0 || caseNum > cases.length - 1) {
        var caseNumber = Math.floor(rand_inc(0, cases.length - 1));
        return cases[caseNumber];
    }
    return cases[caseNum];
}
/**
 * Runs a regular expression to determine whether a field
 * can be filled via information from the test case.
 * @param eName Name attribute of element
 * @param caseNum Test case number
 */
function run_regex(eName, caseNum) {
    // Pattern matching
    var fPatt = /((first)|[f][\s\S]*name)/i;
    var lPatt = /(last|[l][\s\S]*name)/i;
    var addressPatt = /(street|address)/i;
    var cityPatt = /city/i;
    var statePatt = /state/i;
    var zipPatt = /(zip|postal)/i;
    var emailPatt = /email/i;
    var phonePatt = /(phone|cell|mobile)/i;

    var testCase = get_test_case(caseNum);

    if (fPatt.test(eName) && !lPatt.test(eName)) {
        return testCase[0];
    }
    else if (lPatt.test(eName)) {
        return testCase[1];
    }
    else if (addressPatt.test(eName) && !emailPatt.test(eName)) {
        return testCase[2];
    }
    else if (cityPatt.test(eName)) {
        return testCase[3];
    }
    else if (statePatt.test(eName)) {
        return testCase[4];
    }
    else if (zipPatt.test(eName)) {
        return testCase[5];
    }
    else if (emailPatt.test(eName)) {
        return testCase[6];
    }
    else if (phonePatt.test(eName)) {
        return testCase[7];
    }
    return -1;
}

/**
 * Main logic method of going through the page and filling in data
 */
function run_script() 
{
	//uncheck boxes, this handles the case when the 
	//script is ran more than one time without page reload
	uncheck_checkboxes();

	//unselect multiple selects, this handles the case when the 
	//script is ran more than one time without page reload
	uncheck_multsel();

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
    		var subOption = Math.floor(rand_inc(0,subInputs.length-1));

    		//select the radio button
    		subInputs[subOption].checked=true;
    	}
    	else if(eType=="checkbox")
    	{
    		//35% of time check box
    		//65% of time dont check box
    		var ranN = Math.floor();
    		if(rand_inc(1,100)<=35)
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
            if (!RANDOM_DATA) {
                var selNum = RETRIEVED_CASE_NUMBER;
                if (MIX_CASES) {
                    selNum = -1;
                }
                var res = run_regex(elem.name, selNum);

                // if a match for the element is found, assign returned
                // data and continue
                if (res != -1) {
                    elem.value = res;
                    continue;
                }
            }

    		var maxL = elem.maxLength;
    		if(maxL >100)
    		{
    			maxL=100;
    		}
    		var numC = Math.floor(rand_inc(2,maxL));
    		var outStr = "";
    		for(var j=0; j<numC; j++)
    		{
    			//get a biased char
    			outStr += get_biased_char();
    		}
    		elem.value=outStr;
    	}
    }

    //take care of select fields
    var sels = document.getElementsByTagName("select");
    for(var i=0; i<sels.length; i++)
    {
    	var elem = sels[i];
    	if(elem.attributes['multiple']=='undefined')
    	{
    		var opt = Math.floor(rand_inc(0,elem.length-1));
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
    		var selectNum = Math.floor(rand_inc(1,elem.length-1));

    		for(var j=0; j<selectNum; j++)
    		{
    			var opt = Math.floor(rand_inc(0,elem.length-1));
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
    		var numSen = Math.floor(rand_inc(1,6));
    		for(var j=0; j<numSen; j++)
    		{
    			var randSen = Math.floor(rand_inc(0,5));
    			strOut += sent[randSen]+" ";
    		}
    	}
    	elem.value=strOut;
    }
}
run_script();