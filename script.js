document.addEventListener('DOMContentLoaded', () => {
    const targetInput = document.getElementById('target-num');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputDisplay = document.getElementById('output-display');

    // --- EDGE CASE HANDLING FOR INPUT ---
    targetInput.addEventListener('input', function(e) {
        let val = this.value;
        
        // Remove anything that isn't a number, a minus, or a dot
        val = val.replace(/[^0-9.-]/g, '');
        
        // Ensure minus sign is only at the beginning
        if (val.lastIndexOf('-') > 0) {
            val = val.replace(/-/g, '');
            val = '-' + val;
        }

        // Prevent multiple decimal points
        let parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }

        // Limit accuracy to 5 decimal places max
        if (parts.length === 2 && parts[1].length > 5) {
            val = parts[0] + '.' + parts[1].substring(0, 5);
        }

        // Limit total length to prevent massive base numbers
        if (val.length > 12) {
            val = val.substring(0, 12);
        }

        this.value = val;
    });

    // --- MATH GENERATOR LOGIC ---
    function obfuscateMath(targetValue, iterations, allowedRules) {
        let equation = targetValue;

        for (let i = 0; i < iterations; i++) {
            // Regex finds whole numbers or decimals that are standalone
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

        // FINAL SWEEP: Removes any possible whitespace before returning
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