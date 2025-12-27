class Client {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.accounts = [];
    }

    createAccount(account) {
        this.accounts.push(account);
    }

    getTransactionHistory() {
        return this.accounts.reduce((history, account) => {
            return history.concat(account.getTransactionHistory());
        }, []);
    }
}

export default Client;