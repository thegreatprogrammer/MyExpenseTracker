// Pending: reactivate the list update, and solving the bug of expense

// VARIABLES

// Inputs
let description = document.getElementById('description');
let amount = document.getElementById('amount');
let form = document.getElementById('form');
let category = document.getElementById('category');

let list = document.getElementById('list');
let arrList = [];

// Amounts
let total = 0;
document.getElementById('totalEntrance').innerHTML = '0.00';
document.getElementById('totalExpense').innerHTML = '0.00';


category.value = '';

//////////////////////////     FUNCTIONS    ////////////////////////////////


/////////////////////////    UI FUNCTIONS    ///////////////////////////////

// Add item to UI
const updateUI = (desc, amount, category) =>{

    let object;

    if(category === 'entrance'){
        let item = `
        <li class="item entrance" id="entrance">
            <div class="data">
                ${desc}. Total: +<span id="ent">${amount}</span>
            </div>
            <span class="delete">x</span>
        </li>
        `
        list.innerHTML += item;

    } else{
        let item = `
        <li class="item expense" id="expense">
            <div class="data">
                ${desc}. Total: -<span id="exp">${amount}</span>
            </div>
            <span class="delete">x</span>
        </li>
        `
        list.innerHTML += item;

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

const setTotal = (amount, selected) =>{

    let data;

    if(localStorage.getItem('total') === null){

        data = 0;
        localStorage.setItem('total', data);

    } 

    if(localStorage.getItem('entrance') !== null){
        document.getElementById('totalEntrance').innerText = Number(localStorage.getItem('entrance'));
    }

    if(localStorage.getItem('expense') !== null){
        document.getElementById('totalExpense').innerText = Number(localStorage.getItem('expense'));
    }
    
    // If amount exists...
    if(amount){

        if(selected === 'entrance'){
            data = Number(localStorage.getItem('total'));
            data += amount;

            localStorage.setItem('total', JSON.stringify(data));
            document.getElementById('totalAmount').innerText = data;

        } else {
            data = Number(localStorage.getItem('total'));
            data -= amount;

            localStorage.setItem('total', JSON.stringify(data));
            document.getElementById('totalAmount').innerText = data;

        }

    } else{
        document.getElementById('totalAmount').innerText = Number(localStorage.getItem('total'));
    }
}


const pushLocalStorage = (amount, selected) =>{

    let data;

    if(selected === 'entrance'){

        if(localStorage.getItem('entrance') === null){

            localStorage.setItem('entrance', JSON.stringify(amount));
            document.getElementById('totalEntrance').innerText = amount;
            setTotal(amount, selected);

        } else{
            data = Number(localStorage.getItem('entrance'));
            data += amount;

            localStorage.setItem('entrance', JSON.stringify(data));
            document.getElementById('totalEntrance').innerText = data;

            setTotal(amount, selected);

        }

    } else{

        if(localStorage.getItem('expense') === null){

            localStorage.setItem('expense', JSON.stringify(amount));
            document.getElementById('totalExpense').innerText = amount;

            setTotal(amount, selected);

        } else{
            data = Number(localStorage.getItem('expense'));
            data += amount;

            localStorage.setItem('expense', JSON.stringify(data));
            document.getElementById('totalExpense').innerText = data;

            setTotal(amount, selected);


        }
    }
}

// Event listeners

document.addEventListener('DOMContentLoaded', e =>{
    setTotal();
})

form.addEventListener('submit', e =>{
    e.preventDefault();
    
    let selected = category.options[category.selectedIndex].value;
    
    if(description.value != '' && amount.value != ''){
        
        if(selected === 'expense'){

            if(Number(localStorage.getItem('total')) > amount.value){
                // Push to LocalStorage
               pushLocalStorage(Number(amount.value), selected)
               
               // Draw List
               updateUI(description.value, amount.value, selected);

            } else{
                buildMessage('Low budget!');
            }

        }

        if(selected === 'entrance'){
            // Push to LocalStorage
            pushLocalStorage(Number(amount.value), selected)
            
            // Draw List
            updateUI(description.value, amount.value, selected);
        }

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
