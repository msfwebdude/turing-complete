
self.dataBody = {
  steps:       [],
  running:     false,
  interval:    null,
  registerA:   0,
  currentStep: 0,
  output:      0
}



$(document).ready(
  () => {
    $("#addStep").on('click',  add)
    $("#loadTest").on('click', loadTest)
    $("#running").on('change', toggleRunState)

    self.dataBody.interval = self.setInterval(execute, 1000)

    // set dynamic content
    const dateCurrent = new Date();
    self.currentYear.innerHTML = dateCurrent.getFullYear();
  }
)


function add(){

  var id   = createNewId(4)
  var ord  = self.dataBody.steps.length + 1
  var step = {
    id,
    ord
  }
  self.dataBody.steps.push(step)
  
  var div = document.createElement('div')
  div.className="instruction"
  div.id = `step${id}`
  div.innerHTML = `Step&nbsp;${ord}<br />
    <select id="sel${id}" onchange="instructionChange(this)" class="instructionSel">
      <option value="">SELECT</option>
      <option value="BRK">Break</option>
      <option value="INC">Increment (+)</option>
      <option value="DEC">Decrement (-)</option>
      <option value="JMP">Jump:</option>
      <option value="JZR">Jump if Zero:</option>
      <option value="STA">Output Reg. A:</option>
    <select><br />
    <label for="txt${id}" id="lbl${id}" class="instructionLabel" style="display: none;">Steps</label>
    <input type="number"  id="txt${id}" class="instructionText"  style="display: none;" onchange="instructionChange(this)">
  `
  self.queue.appendChild(div)

  $(`#sel${id}`).on('change', )

  recalcStats()
}

function loadTest(){
  for (let i = 1; i < 6; i++) {
    add()
  }
  
  self[`sel${self.dataBody.steps[0].id}`].selectedIndex = 2
  self[`sel${self.dataBody.steps[1].id}`].selectedIndex = 3
  self[`sel${self.dataBody.steps[2].id}`].selectedIndex = 5
  self[`sel${self.dataBody.steps[3].id}`].selectedIndex = 1
  self[`sel${self.dataBody.steps[4].id}`].selectedIndex = 2

  self[`sel${self.dataBody.steps[0].id}`].onchange()
  self[`sel${self.dataBody.steps[1].id}`].onchange()
  self[`sel${self.dataBody.steps[2].id}`].onchange()
  self[`sel${self.dataBody.steps[3].id}`].onchange()
  self[`sel${self.dataBody.steps[4].id}`].onchange()

  self[`txt${self.dataBody.steps[2].id}`].value = 1
  self[`txt${self.dataBody.steps[2].id}`].onchange()
}

function instructionChange(t){
  var id   = t.id.substr(3,4)
  var idx  = getIndexForId(id)
  var step = self.dataBody.steps[idx]

  if (t.tagName == 'SELECT') {
    step.opcode = t.value

    var lbl = self[`lbl${id}`]
    var txt = self[`txt${id}`]
    
    lbl.style.display = 'none'
    txt.style.display = 'none'

    if (t.value == 'JMP' || t.value == 'JZR' ) {
      lbl.style.display = 'inline'
      txt.style.display = 'inline-block'
    }
  }
  if (t.tagName == 'INPUT') {
    step.operand = t.value
  }
  
  console.log(step)
}

function execute(){
  
  recalcStats()

  self.dataBody.steps.forEach(step => self[`step${step.id}`].classList.remove('running'));

  if (self.dataBody.running) {
    var step   = self.dataBody.steps[self.dataBody.currentStep]
    var select = self[`sel${step.id}`].value

    self[`step${step.id}`].classList.add('running')

    if (self.dataBody.currentStep == 0) self.queue.scrollLeft = 0
    else                                self[`step${step.id}`].scrollIntoView();

    switch (select) {
      case "INC":
        self.dataBody.registerA++;
        break;

      case "DEC":
        self.dataBody.registerA--;
        break;

      case "BRK":
        self.dataBody.running = false
        break;
      
      case "JMP":
        self.dataBody.currentStep += Number(self[`txt${step.id}`].value)
        break;
      
      case "JZR":
        if (self.dataBody.registerA == 0) self.dataBody.currentStep += Number(self[`txt${step.id}`].value)
        break;

      case "STA":
        self.dataBody.output = self.dataBody.registerA
        break;

    }

    self.dataBody.currentStep++
    if (self.dataBody.currentStep >= self.dataBody.steps.length) self.dataBody.currentStep = 0
    if (self.dataBody.currentStep < 0) self.dataBody.currentStep = 0
  }

}

function toggleRunState(){
  self.dataBody.running = (self.running.checked)
}

function recalcStats(){
  self.steps.innerHTML = self.dataBody.steps.length
  self.alpha.innerHTML = self.dataBody.registerA
  self.point.innerHTML = self.dataBody.currentStep + 1
  self.state.innerHTML = (self.dataBody.running ? 'Running' : 'Stopped')
  self.yield.innerHTML = self.dataBody.output
  self.running.checked = self.dataBody.running 
}

function createNewId(length){
  var elements = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var strLimit = length || 32;
  var neoId    = "";
  for (var i = 0; i < strLimit; i++) { neoId += elements.substr(Math.floor(Math.random() * elements.length), 1); }
  return neoId;
}

function getIndexForId(id){
  var idx = null

  self.dataBody.steps.forEach(
    (step, i) => { 
      if (step.id == id) idx = i 
    }
  );

  return idx;
}