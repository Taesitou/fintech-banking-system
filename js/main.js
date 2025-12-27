// main.js
// Sistema de gestión bancaria con navegación entre pantallas

let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// Navegación entre pantallas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Botones de navegación en pantalla de bienvenida
    document.getElementById('go-to-login').addEventListener('click', () => {
        showScreen('login-screen');
    });

    document.getElementById('go-to-register').addEventListener('click', () => {
        showScreen('register-screen');
    });

    // Botones de volver
    document.getElementById('back-to-welcome-login').addEventListener('click', () => {
        showScreen('welcome-screen');
    });

    document.getElementById('back-to-welcome-register').addEventListener('click', () => {
        showScreen('welcome-screen');
    });

    // Formulario de registro
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const initialDeposit = parseFloat(document.getElementById('initial-deposit').value);

        // Verificar si el usuario ya existe
        if (users.find(user => user.email === email)) {
            alert('El email ya está registrado');
            return;
        }

        // Crear nuevo usuario
        const newUser = {
            name: name,
            email: email,
            password: password,
            balance: initialDeposit,
            transactions: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Cuenta creada exitosamente!');
        document.getElementById('register-form').reset();
        showScreen('login-screen');
    });

    // Formulario de login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user;
            loadDashboard();
            showScreen('dashboard-screen');
            document.getElementById('logout-btn').style.display = 'block';
            document.getElementById('login-form').reset();
        } else {
            alert('Email o contraseña incorrectos');
        }
    });

    // Formulario de transferencia
    document.getElementById('transfer-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const recipientEmail = document.getElementById('recipient-email').value;
        const amount = parseFloat(document.getElementById('transfer-amount').value);

        if (recipientEmail === currentUser.email) {
            alert('No puedes transferir a tu propia cuenta');
            return;
        }

        if (amount <= 0) {
            alert('El monto debe ser mayor a 0');
            return;
        }

        if (amount > currentUser.balance) {
            alert('Saldo insuficiente');
            return;
        }

        const recipient = users.find(u => u.email === recipientEmail);

        if (!recipient) {
            alert('Destinatario no encontrado');
            return;
        }

        // Realizar transferencia
        currentUser.balance -= amount;
        recipient.balance += amount;

        // Registrar transacción para el emisor
        const transactionSent = {
            type: 'sent',
            amount: amount,
            to: recipientEmail,
            date: new Date().toLocaleString()
        };
        currentUser.transactions.push(transactionSent);

        // Registrar transacción para el receptor
        const transactionReceived = {
            type: 'received',
            amount: amount,
            from: currentUser.email,
            date: new Date().toLocaleString()
        };
        recipient.transactions.push(transactionReceived);

        // Actualizar localStorage
        localStorage.setItem('users', JSON.stringify(users));

        alert('Transferencia exitosa!');
        document.getElementById('transfer-form').reset();
        loadDashboard();
    });

    // Formulario de depósito
    document.getElementById('deposit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('deposit-amount').value);

        if (amount <= 0) {
            alert('El monto debe ser mayor a 0');
            return;
        }

        // Agregar dinero al balance
        currentUser.balance += amount;

        // Registrar transacción de depósito
        const transactionDeposit = {
            type: 'deposit',
            amount: amount,
            date: new Date().toLocaleString()
        };
        currentUser.transactions.push(transactionDeposit);

        // Actualizar localStorage
        localStorage.setItem('users', JSON.stringify(users));

        alert('Depósito exitoso!');
        document.getElementById('deposit-form').reset();
        loadDashboard();
    });

    // Navegación del menú del dashboard
    document.getElementById('btn-transfer').addEventListener('click', () => {
        showDashboardSection('transfer-section');
        setActiveMenuBtn('btn-transfer');
    });

    document.getElementById('btn-deposit').addEventListener('click', () => {
        showDashboardSection('deposit-section');
        setActiveMenuBtn('btn-deposit');
    });

    document.getElementById('btn-history').addEventListener('click', () => {
        showDashboardSection('history-section');
        setActiveMenuBtn('btn-history');
    });

    // Botón de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        currentUser = null;
        document.getElementById('logout-btn').style.display = 'none';
        showScreen('welcome-screen');
    });
});

// Cargar información del dashboard
function loadDashboard() {
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-balance').textContent = currentUser.balance.toFixed(2);

    // Cargar historial de transacciones
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    if (currentUser.transactions.length === 0) {
        transactionList.innerHTML = '<li style="border: none; background: transparent;">No hay transacciones</li>';
    } else {
        currentUser.transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.classList.add(`transaction-${transaction.type}`);
            
            if (transaction.type === 'sent') {
                li.innerHTML = `
                    <strong>Enviado</strong><br>
                    A: ${transaction.to}<br>
                    Monto: -$${transaction.amount.toFixed(2)}<br>
                    Fecha: ${transaction.date}
                `;
            } else if (transaction.type === 'received') {
                li.innerHTML = `
                    <strong>Recibido</strong><br>
                    De: ${transaction.from}<br>
                    Monto: +$${transaction.amount.toFixed(2)}<br>
                    Fecha: ${transaction.date}
                `;
            } else if (transaction.type === 'deposit') {
                li.innerHTML = `
                    <strong>Depósito</strong><br>
                    Monto: +$${transaction.amount.toFixed(2)}<br>
                    Fecha: ${transaction.date}
                `;
            }
            
            transactionList.appendChild(li);
        });
    }
}

// Mostrar sección del dashboard
function showDashboardSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Activar botón del menú
function setActiveMenuBtn(btnId) {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(btnId).classList.add('active');
}