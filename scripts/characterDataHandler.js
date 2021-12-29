//Saving character data
function saveData() {
  let elementValueObj = new Object();
  //Save Stenogrpah version number
  elementValueObj["stenographVersion"] = stenographVersion;

  //Save skill proficiencies
  let skillprof = document.querySelectorAll("div.skillprofbox div");
  for (let i = 0; i < skillprof.length; i++) {
    //console.log(skillprof[i].getAttribute("class"));
    elementValueObj[skillprof[i].getAttribute("name")] =
      skillprof[i].getAttribute("class");
  }

  //Save rest of inputs
  let charsheet = document.getElementById("charsheet");
  for (let i = 0; i < charsheet.length; i++) {
    let desValue;
    if (charsheet[i].type == "text" || charsheet[i].type == "textarea") {
      desValue = charsheet[i].value;
    } else if (charsheet[i].type == "checkbox") {
      desValue = charsheet[i].checked;
    }

    elementValueObj[charsheet[i].name] = desValue;
  }

  jsonText = JSON.stringify(elementValueObj, null, "\t"); //translate object to JSON

  //Prompt user with download
  let a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(jsonText)
  );
  if (!charsheet[0].value) {
    a.setAttribute("download", "stenograph_character.json");
  } else {
    a.setAttribute("download", `stenograph_${charsheet[0].value}.json`);
  }
  a.click();
}

//Once file has been uploaded, run loadData
$(document).ready(function () {
  $(".loaddata").change(function () {
    loadData();
  });
});

//Loading character data
function loadData() {
  let loadDataButton = document.getElementsByClassName("loaddata");
  let files = loadDataButton[0].files;

  if (files.length !== 1) {
    //Invalid upload
    alert("Submit exactly one .json or .txt!");
    return false;
  } else {
    let fr = new FileReader();

    fr.onload = function (e) {
      let result = JSON.parse(e.target.result);
      let jsonText = JSON.stringify(result, null, 2);
      let dataObj = JSON.parse(jsonText);

      //Check stenograph version of loaded data
      if (dataObj["stenographVersion"] !== stenographVersion) {
        alert(
          `Different version warning!\n\nThis character sheet was made on an different version of Stenograph (Current Stenograph version: ${stenographVersion}; Your character sheet's Stenograph version: ${dataObj["stenographVersion"]}). Some data may not transfer or may transfer incorrectly!\n\nTypically, this will happen between feature updates: when the second number in the verison number changes. Ex: 1.4.0 -> 1.5.0.`
        );
      }

      //Load skill proficiencies
      let skillprof = document.querySelectorAll("div.skillprofbox div");
      for (let i = 0; i < skillprof.length; i++) {
        skillprof[i].className = dataObj[skillprof[i].getAttribute("name")];
      }

      //Load rest of inputs
      let charsheet = document.getElementById("charsheet");
      for (let i = 0; i < charsheet.length; i++) {
        let value = dataObj[charsheet[i].name];
        if (charsheet[i].type == "text" || charsheet[i].type == "textarea") {
          if (!value && value !== 0) {
            //value DNE
            value = "";
          }
          charsheet[i].value = value;
        } else if (charsheet[i].type == "checkbox") {
          if (!value && value !== 0) {
            //value DNE
            value = false;
          }
          charsheet[i].checked = value;
        }
      }
    };

    fr.readAsText(files.item(0));
  }
}