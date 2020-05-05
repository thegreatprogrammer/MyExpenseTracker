let description = document.getElementById('description');
let amount = document.getElementById('amount');
let send = document.getElementById('send');

let list = document.getElementById('list');

const updateUI = (desc, amount) =>{
    list.innerHTML += `
        <li class="item">
            ${desc}. Total: ${amount} <span class="delete">x</span>
        </li>
    `
}

send.addEventListener('click', e =>{
    e.preventDefault();

    updateUI(description.value, amount.value);
})
