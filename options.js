// Saves options to chrome.storage
function save_options() {
  var randomCases = document.getElementById('random_cases').checked;
  var testCase = document.getElementById('test_case').value;
  console.log("randomd "+randomCases);
  console.log("testCase "+testCase);
  chrome.storage.sync.set({
    random_cases: randomCases,
    test_case: testCase
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    random_cases: true,
    test_case: 1
  }, function(items) {
    console.log("restoring");
    console.log("randomd "+items.random_cases);
    console.log("testCase "+items.test_case);
    if (items.random_cases) {
      document.getElementById('random_cases').checked = true;
      document.getElementById('realistic_cases').checked = false;
    } 
    else {
      document.getElementById('random_cases').checked = false;
      document.getElementById('realistic_cases').checked = true;
    }
    //document.getElementById('test_case').value = items.test_case;
    document.getElementById('test_case').options[items.test_case].selected = true;
    var caseOpts = document.getElementById('case_options');
    var cases = get_all_test_cases();
    for (var i = 0; i < cases.length; i++) {
      caseOpts.innerHTML = caseOpts.innerHTML + '<br>' + cases[i][0];
    }
  });
}

function get_all_test_cases() {
    var cases = [
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
    return cases;
}

// retrieve data
document.addEventListener('DOMContentLoaded', restore_options);

// listen for the 'Save' button
document.getElementById('save').addEventListener('click', save_options);