class TransactionService {
    constructor() {
        this.transactions = [];
    }

    transferFunds(senderEmail, recipientEmail, amount) {
        const transaction = {
            transactionId: this.generateTransactionId(),
            amount: amount,
            date: new Date(),
            type: 'transfer',
            sender: senderEmail,
            recipient: recipientEmail
        };
        
        this.transactions.push(transaction);
        return transaction;
    }

    getTransactions(account) {
        return this.transactions.filter(transaction => 
            transaction.sender === account.email || transaction.recipient === account.email
        );
    }

    generateTransactionId() {
        return 'txn_' + Math.random().toString(36).substr(2, 9);
    }
}

export default TransactionService;