var i=0;
function addTodo() {
    if (i==0) {
        todofield.value="Du";
    } else if (i==1) {
        todofield.value="stinkst";
    }
    if (todofield.value!=""){
    todolist.innerHTML += `
            <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
            <i class="material-icons  mdl-list__item-avatar">person</i>
            ${todofield.value}
            </span>
            <span class="mdl-list__item-secondary-action">
            <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-1">
                <input type="checkbox" id="list-checkbox-1" class="mdl-checkbox__input" checked />
            </label>
            </span>
        </li>
        `
        };
        i++;
        todofield.value="";
    }

var click=0;
var hiddenclick=0;
var seconds=0; 
var idle=0;
var cps=0;
function clicks() {
    if (idle==0) {
        interval=setInterval(cpsCalc, 1000);
    }
    idle=1;
    click +=1;
    hiddenclick+=1;
    clicker.innerHTML = click;
}

function resetclick() {
    click=hiddenclick=idle=seconds=0;
    clearInterval(interval);
    clicker.innerHTML = click;
    cpsid.innerHTML = 0;
}

function cpsCalc() {
    seconds +=1;
    idle+=1;
    cps = hiddenclick / seconds;
    cps = cps.toFixed(2)
    cpsid.innerHTML = cps;
    if (idle>2) {
        clearInterval(interval);
        seconds=hiddenclick=idle=0;
    } 
    
}


