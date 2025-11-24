
class Calculator {
    constructor() {
        const displayElement = document.querySelector('.inputCal');
        if (!(displayElement instanceof HTMLInputElement)) {
            throw new Error('Display element not found or is not an input element');
        }
        this.display = displayElement;
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForNumber = true; 
        this.setupEvents(); 
        this.updateDisplay();
    }

    setupEvents() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const action = target.dataset.action;
                const value = target.textContent || '';
                this.handleInput(action, value);
            });
        });
    }

    handleInput(action, value) {
        console.log(`Нажата кнопка: ${value}, действие: ${action}`);
        if (action === 'clear') {
            this.clear();
        }
        else if (action === '=') {
            this.calculate();
        }
        else if (['+', '-', 'x', '/'].includes(value)) {
            this.setOperator(value);
        }
        else {
            this.addNumber(value);
        }
    }

    addNumber(num) {
        if (this.waitingForNumber) { 
            this.currentValue = num;
            this.waitingForNumber = false; 
        }
        else if (this.currentValue === '0') {
            this.currentValue = num;
        }
        else {
            this.currentValue += num;
        }
        this.updateDisplay();
    }
    setOperator(op) {
        if (!this.waitingForNumber) {
            if (this.operator) {
                this.calculate();
            }
            this.previousValue = this.currentValue;
            this.operator = op;
            this.waitingForNumber = true;
        }
    }
    calculate() {
        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        if (isNaN(prev) || isNaN(current))
            return;
        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
            case 'x':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }
        this.currentValue = result.toString();
        this.operator = null;
        this.previousValue = '';
        this.waitingForNumber = true;
        this.updateDisplay();
    }
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForNumber = true;
        this.updateDisplay();
    }
    updateDisplay() {
        this.display.value = this.currentValue;
    }
}
const calculator = new Calculator();
//# sourceMappingURL=script.js.map