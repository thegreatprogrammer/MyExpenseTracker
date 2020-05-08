// Pending: reactivate the list update, and solving the bug of expense

// VARIABLES

// Inputs
let description = document.getElementById('description');
let amount = document.getElementById('amount');
let form = document.getElementById('form');
let category = document.getElementById('category');

let list = document.getElementById('list');

// Amounts
let total = 0;

category.value = '';

//////////////////////////     FUNCTIONS    ////////////////////////////////

// Init function
const init = (category, amount) =>{

    let total = document.getElementById('totalAmount');
    let expense = document.getElementById('totalExpense');
    let entrance = document.getElementById('totalEntrance');
    let storage;

    // Valor inicial del total en local storage
    if(localStorage.getItem('total') === null){

        total.innerHTML = '0.00';
        localStorage.setItem('total', '0');

    } else{

        storage = Number(localStorage.getItem('total'));
        
        if(category === 'entrance'){
            storage += Number(amount);
        }

        if(category === 'expense'){
            storage -= Number(amount);
        }
        
        total.innerHTML = storage;
        localStorage.setItem('total', JSON.stringify(storage));

    }

    // Valores de expense y entrance, sacados de local Storage

    if(localStorage.getItem('entrance') === null){

        entrance.innerHTML = '0.00';

    } else{

        entrance.innerHTML = getTotalAmount('entrance');

    }

    ////

    if(localStorage.getItem('expense') === null){

        expense.innerHTML = '0.00';

    } else{

        expense.innerHTML = getTotalAmount('expense');

    }
}

// MAIN FUNCTION. Based in category selected, each action will be executed

const App = (description, amount, selected) =>{

    if(selected === 'entrance'){

        updateEntranceStorage(description, amount, selected);

    } 
    
    else{

        updateExpenseStorage(description, amount, selected);

    }

}

/////////////////////////    UI FUNCTIONS    ///////////////////////////////

// Add item to UI
const updateUI = (desc, amount, category) =>{

    if(category === 'entrance'){
        list.innerHTML += `
            <li class="item entrance" id="entrance">
                <div class="data">
                    ${desc}. Total: +<span id="ent">${amount}</span>
                </div>
                <span class="delete">x</span>
            </li>
        `
        console.log('nueva entrada');
        
    } else{
        list.innerHTML += `
            <li class="item expense" id="expense">
                <div class="data">
                    ${desc}. Total: -<span id="exp">${amount}</span>
                </div>
                <span class="delete">x</span>
            </li>
        `
        console.log('nueva entrada');
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


// Show a message when something is wrong
const buildMessage = text =>{

    let message = document.getElementById('message');
    message.innerHTML = `
        <p class="message">${text}</p>
    `;

    setTimeout(() => message.innerHTML = '', 3000);
}

/////////////////////    LOCAL STORAGE FUNCTIONS    ////////////////////////

const updateEntranceStorage = (description, amount, selected) =>{

    if(localStorage.getItem('entrance') === null){

        let arrEntrance = [];

        arrEntrance.push(amount);

        localStorage.setItem('entrance', JSON.stringify(arrEntrance));

        totalEntrance.innerText = amount;

        updateUI(description, amount, selected);


    } else{
        let entrance = JSON.parse(localStorage.getItem('entrance'));

        entrance.push(amount);

        localStorage.setItem('entrance', JSON.stringify(entrance));
        
        totalEntrance.innerText = getTotalAmount('entrance');

        updateUI(description, amount, selected);

    }

}

const updateExpenseStorage = (description, amount, selected) =>{
    if(amount < Number(getTotalAmount('entrance'))){
        if(localStorage.getItem('expense') === null){

            let arrExpense = [];

            arrExpense.push(amount);

            localStorage.setItem('expense', JSON.stringify(arrExpense));

            totalExpense.innerText = amount;

            updateUI(description, amount, selected);

        } else{
            let expense = JSON.parse(localStorage.getItem('expense'));

            expense.push(amount);

            localStorage.setItem('expense', JSON.stringify(expense));

            totalExpense.innerText = getTotalAmount('expense');

            updateUI(description, amount, selected);

        }

    } else{
        buildMessage('Low Budget!');
    }
}

const getTotalAmount = category =>{

    const entrance = JSON.parse(localStorage.getItem(category));

    if(entrance){
        const total = entrance.reduce( (a, b) => Number(a) + Number(b));
    
        return Number(total);
        
    } else{
        return 0;
    }
}

// Event listeners

document.addEventListener('DOMContentLoaded', e =>{
    init();
})

form.addEventListener('submit', e =>{
    e.preventDefault();
    
    let selected = category.options[category.selectedIndex].value;
    
    if(description.value != '' && amount.value != ''){
        
        App(description.value, amount.value, selected);

        init(selected, amount.value);
        
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

        // Delete in LocalStorage
    }
});
