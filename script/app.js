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

const showTransactions = () =>{

    if(localStorage.getItem('transaction') === null){
        // Array for transactions
        let transaction = [];

        // LocalStorage for transactions
        localStorage.setItem('transaction', JSON.stringify(transaction));

    }

    let data = JSON.parse(localStorage.getItem('transaction'));

    data.forEach( element => {
        let item = `
        <li class="item ${element.category}" id="${element.category}">
            <div class="data">
                <div>${element.description}</div> Total: +<span id="ent">${element.amount}</span>
            </div>
            <span class="delete">x</span>
        </li>
        `
        list.innerHTML += item;
    });
}

// Add item to UI
const updateUI = (desc, amount, category) =>{

    let object, data;

    if(category === 'entrance'){
        let item = `
        <li class="item entrance" id="entrance">
            <div class="data">
                <div>${desc}</div> Total: +<span id="ent">${amount}</span>
            </div>
            <span class="delete">x</span>
        </li>
        `
        list.innerHTML += item;
        
        object = {
            description: desc,
            amount: amount,
            category: 'entrance'
        }

    } else{
        let item = `
        <li class="item expense" id="expense">
            <div class="data">
                <div>${desc}</div> Total: -<span id="exp">${amount}</span>
            </div>
            <span class="delete">x</span>
        </li>
        `
        list.innerHTML += item;

        object = {
            description: desc,
            amount: amount,
            category: 'expense'
        };

    }

    // Saving the new transaction object in the array and push to Local Storage
    data = JSON.parse(localStorage.getItem('transaction'));
    data.push(object);

    localStorage.setItem('transaction', JSON.stringify(data));

}

// Delete the selectioned item
const deleteItem = (e, category, description) =>{

    let data;
    
    if(category === 'entrance'){
        // Restando el monto de las entradas
        data = localStorage.getItem('entrance');
        data -= Number(e.parentElement.childNodes[1].childNodes[3].innerText);
        localStorage.setItem('entrance', data);

        // Imprimiendo el nuevo valor
        document.getElementById('totalEntrance').innerText = data;

        // Restando el monto del total
        data = Number(localStorage.getItem('total'));
        data -= Number(e.parentElement.childNodes[1].childNodes[3].innerText);

        localStorage.setItem('total', data);
        
        document.getElementById('totalAmount').innerText = data;

    }

    if(category === 'expense'){
        // Restando el monto de los gastos
        data = Number(localStorage.getItem('expense'));
        data -= Number(e.parentElement.childNodes[1].childNodes[3].innerText);
        localStorage.setItem('expense', data);

        // Imprimiendo el nuevo valor
        document.getElementById('totalExpense').innerText = data;

        // Devolviendo el monto al total
        data = Number(localStorage.getItem('total'));
        data += Number(e.parentElement.childNodes[1].childNodes[3].innerText);
        localStorage.setItem('total', data);
        
        document.getElementById('totalAmount').innerText = data;
    }

    e.parentElement.remove();

    let trans = JSON.parse(localStorage.getItem('transaction'));

    let index = trans.findIndex(element => element.description === description);

    trans.splice(index, 1);

    localStorage.setItem('transaction', JSON.stringify(trans));
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
    showTransactions();
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

    let description;

    if(e.target.classList.contains('delete') && e.target.parentElement.classList.contains('entrance')){

        description = e.target.previousElementSibling.childNodes[1].innerText;
        deleteItem(e.target, 'entrance', description);

    }

    if(e.target.classList.contains('delete') && e.target.parentElement.classList.contains('expense')){

        description = e.target.previousElementSibling.childNodes[1].innerText;
        deleteItem(e.target, 'expense', description);

    }
});
