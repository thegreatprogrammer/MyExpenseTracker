// Inputs
let description = document.getElementById('description');
let amount = document.getElementById('amount');
let form = document.getElementById('form');
let category = document.getElementById('category');

let list = document.getElementById('list');

// Amounts
let total = 0;
let expense = 0;
let entrance = 0;
category.value = '';

// Add item to UI
const updateUI = (desc, amount, category) =>{

    if(category === 'entrance'){
        list.innerHTML += `
            <li class="item entrance">
                <div class="data">
                    ${desc}. Total: +<span id="ent">${amount}</span>
                </div>
                <span class="delete">x</span>
            </li>
        `
    } else{
        list.innerHTML += `
            <li class="item expense">
                <div class="data">
                    ${desc}. Total: -<span id="exp">${amount}</span>
                </div>
                <span class="delete">x</span>
            </li>
        `
    }
}

// Delete the selectioned item
const deleteItem = e =>{
    if(e.parentElement.classList.contains('entrance')){

        let value = Number(e.previousSibling.previousSibling.childNodes[1].innerText);
        entrance -= value;
        total -= value;

        document.getElementById('totalAmount').innerText = total;
        document.getElementById('totalEntrance').innerText = entrance;
    }
    
    if(e.parentElement.classList.contains('expense')){

        let value = Number(e.previousSibling.previousSibling.childNodes[1].innerText);
        expense -= value;
        total += value;

        document.getElementById('totalAmount').innerText = total;
        document.getElementById('totalExpense').innerText = expense;
    }

    e.parentElement.remove();
}

// Update Amounts UI
const updateTracker = (cat, value, amount) =>{

    let totalDiv = document.getElementById('totalAmount');

    if(cat === 'entrance'){
        let entrance = document.getElementById('totalEntrance');
        entrance.innerText = `+${value}`;

        total += amount;
        totalDiv.innerText = total;
        
    } else{
        let expense = document.getElementById('totalExpense');
        expense.innerText = `-${value}`;

        total -= amount;
        totalDiv.innerText = total;
    }
}

// Based in category selected, each action will be executed
const myApp = selected =>{
    if(selected === 'entrance'){
        entrance += Number(amount.value);
        updateUI(description.value, amount.value, selected);
        updateTracker(selected, entrance, Number(amount.value));
    }
    
    if(selected === 'expense'){
        if(amount.value < total){
            expense += Number(amount.value);
            updateUI(description.value, amount.value, selected);
            updateTracker(selected, expense,Number(amount.value));

        } else {
            buildMessage('Low budget! Sorry');
        }
    }
}

// Show a message when something is wrong
const buildMessage = text =>{

    let message = document.getElementById('message');
    message.innerHTML = `
        <p class="message">${text}</p>
    `;

    setTimeout(() => message.innerHTML = '', 3000);
}

// Add Local Storage

// Event listeners

form.addEventListener('submit', e =>{
    e.preventDefault();

    let selected = category.options[category.selectedIndex].value;

    if(description.value != '' && amount.value != ''){

        myApp(selected);

        description.value = "";
        amount.value = "";
    } 
        
    else{
        buildMessage('Fill the fields');
    }

});

list.addEventListener('click', e =>{
    if(e.target.classList.contains('delete')){
        deleteItem(e.target);
    }
});
