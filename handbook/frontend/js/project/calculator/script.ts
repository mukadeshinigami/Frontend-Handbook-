class Calculator {

    private display: HTMLInputElement;
    private currentValue: string;
    private previousValue: string;
    private operator: string | null;
    private waitingForNumber: boolean; 

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

    private setupEvents(): void {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const action = target.dataset.action;
                const value = target.textContent || '';

                this.handleInput(action, value);
            });
        });

    }

    private handleInput(action: string | undefined, value: string): void {
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

    private addNumber(num: string): void {
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

    private setOperator(op: string): void {
        if (!this.waitingForNumber) { 
            if (this.operator) {
                this.calculate();
            }
            this.previousValue = this.currentValue;
            this.operator = op;
            this.waitingForNumber = true; 
        }
    }

    private calculate(): void {
        let result: number;
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

    private clear(): void {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForNumber = true; 

        this.updateDisplay();
    }

    private updateDisplay(): void {
        this.display.value = this.currentValue;
    }
}

const calculator = new Calculator();