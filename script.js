document.addEventListener('DOMContentLoaded', () => {
    const targetInput = document.getElementById('target-num');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputDisplay = document.getElementById('output-display');

    // --- EDGE CASE HANDLING FOR INPUT ---
    targetInput.addEventListener('input', function(e) {
        let val = this.value;
        val = val.replace(/[^0-9.-]/g, '');
        if (val.lastIndexOf('-') > 0) {
            val = val.replace(/-/g, '');
            val = '-' + val;
        }
        let parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts.length === 2 && parts[1].length > 5) {
            val = parts[0] + '.' + parts[1].substring(0, 5);
        }
        if (val.length > 12) {
            val = val.substring(0, 12);
        }
        this.value = val;
    });

    // --- MATH GENERATOR LOGIC ---
    function obfuscateMath(targetValue, iterations, allowedRules) {
        let equation = targetValue.toString();
        let numTarget = parseFloat(targetValue);

        // --- THE BASE SCRAMBLER ---
        // If it's a valid number and arithmetic is allowed, split the base number immediately!
        // this basically prevents the user from decoding the number easily based on the initial digit
        if (!isNaN(numTarget) && allowedRules.includes('arithmetic')) {
            let r = Math.floor(Math.random() * 20) + 2; // Random number 2 to 21
            
            if (Math.random() > 0.5) {
                // Addition Split: 13 becomes (8 + 5)
                let part1 = numTarget - r;
                // Rounding to fix floating point errors (e.g. 0.1 + 0.2)
                part1 = Math.round(part1 * 100000) / 100000; 
                equation = `(${part1}+${r})`;
            } else {
                // Multiplication Split: 13 becomes (26 / 2)
                let part1 = numTarget * r;
                part1 = Math.round(part1 * 100000) / 100000;
                equation = `(${part1}/${r})`;
            }
        }

        // --- THE RECURSION LOOP ---
        for (let i = 0; i < iterations; i++) {
            let numMatches = [...equation.matchAll(/\b\d+(\.\d+)?\b/g)];
            if (numMatches.length === 0 || allowedRules.length === 0) break;

            let match = numMatches[Math.floor(Math.random() * numMatches.length)];
            let numStr = match[0];
            
            let rule = allowedRules[Math.floor(Math.random() * allowedRules.length)];
            let replacement = "";
            let r = Math.floor(Math.random() * 50) + 2; 

            switch (rule) {
                case 'arithmetic':
                    if (Math.random() > 0.5) {
                        replacement = `(${numStr}+${r}-${r})`;
                    } else {
                        replacement = `(${numStr}*${r}/${r})`;
                    }
                    break;
                case 'constants':
                    if (Math.random() > 0.5) {
                        replacement = `(${numStr}*(π/π))`;
                    } else {
                        replacement = `(${numStr}*ln(e))`;
                    }
                    break;
                case 'trigonometry':
                    replacement = `(${numStr}*(sin²(${r})+cos²(${r})))`;
                    break;
                case 'calculus':
                    replacement = `(${numStr}*(d/dx(x)))`; 
                    break;
            }

            equation = equation.substring(0, match.index) + replacement + equation.substring(match.index + numStr.length);
        }

        return equation.replace(/\s+/g, '');
    }

    // --- BUTTON ACTIONS ---
    generateBtn.addEventListener('click', () => {
        let targetValue = targetInput.value;
        if (!targetValue || targetValue === '-' || targetValue === '.') {
            targetValue = '1'; 
            targetInput.value = '1';
        }

        const checkboxes = document.querySelectorAll('.rule-check:checked');
        const allowedRules = Array.from(checkboxes).map(cb => cb.value);

        if (allowedRules.length === 0) {
            outputDisplay.textContent = "Please select at least one ingredient!";
            return;
        }

        const iterations = parseInt(document.getElementById('complexity').value);

        const result = obfuscateMath(targetValue, iterations, allowedRules);
        outputDisplay.textContent = result;
        copyBtn.textContent = "Copy to Clipboard"; 
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = outputDisplay.textContent;
        if (textToCopy && textToCopy !== "Your equation will appear here..." && textToCopy !== "Please select at least one ingredient!") {
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => {
                    copyBtn.textContent = "Copy to Clipboard";
                }, 2000);
            });
        }
    });
});