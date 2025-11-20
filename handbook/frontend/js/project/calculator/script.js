class Calculator {
    constructor() {
        this.display = document.querySelector('.inputCal');
        this.currentValue = '0'; 
        this.previousValue = '';
        this.operator = null;
        this.waitinForNumber = true;

        this.setupEvent();
        this.updateDisplay();
    }

setupEvent() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action; //
                const value = e.target.textContent;

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
    if (this.waitinForNumber) {
        this.currentValue = num;
        this.waitinForNumber = false;
    }
    else if (this.currentValue === 0) 
        this.currentValue = num;
    else 
        this.currentValue += num;

    this.updateDisplay();

}

setOperator(op) { 
    if (!this.waitinForNumber) {
        if (this.operator) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operator = op;
        this.waitinForNumber = true;
    }
}

calculate() {
    let result;
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
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
    this.waitinForNumber = true;

    this.updateDisplay();

}

clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitinForNumber = true;

        this.updateDisplay();

}

    updateDisplay() {   
        this.display.value = this.currentValue; 
    }
}


const calculator = new Calculator(); 