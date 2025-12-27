class AuthService {
    constructor() {
        this.clients = JSON.parse(localStorage.getItem('clients')) || [];
    }

    register(email, password) {
        if (this.clients.find(client => client.email === email)) {
            throw new Error('Email already registered');
        }
        const newClient = { email, password };
        this.clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(this.clients));
        return newClient;
    }

    login(email, password) {
        const client = this.clients.find(client => client.email === email && client.password === password);
        if (!client) {
            throw new Error('Invalid email or password');
        }
        return client;
    }
}

export default AuthService;