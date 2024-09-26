// app.js
const loginButton = document.getElementById('login-btn');
const fetchExpensesButton = document.getElementById('fetch-expenses-btn');
const expenseList = document.getElementById('expense-list');
const expensesSection = document.getElementById('expenses');

const API_URL = 'http://localhost:3000/api'; // Adjust based on your server URL

loginButton.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        expensesSection.style.display = 'block';
        document.getElementById('auth').style.display = 'none';
    } else {
        alert('Login failed!');
    }
});

fetchExpensesButton.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/expenses`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const expenses = await response.json();
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.category}: $${expense.amount} (${expense.description})`;
            expenseList.appendChild(li);
        });
    } else {
        alert('Failed to fetch expenses!');
    }
});
