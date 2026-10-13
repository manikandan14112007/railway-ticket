/**
 * Railway Ticket Booking System - Strict Input Validation Module
 * Handles field-level validation, live character restrictions, and form validations.
 */

const Validator = {
    // Regular Expressions
    regex: {
        alphabetOnly: /^[A-Za-z\s]+$/,
        numberOnly: /^[0-9]+$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[6-9][0-9]{9}$/,
        cardNumber: /^[0-9]{16}$/,
        cvv: /^[0-9]{3}$/,
        upi: /^[\w.-]+@[\w.-]+$/
    },

    /**
     * Set error message and style on an input element
     */
    showError(inputElement, message) {
        if (!inputElement) return false;
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
        
        let errorSpan = inputElement.parentElement.querySelector('.field-error');
        if (!errorSpan) {
            errorSpan = document.createElement('div');
            errorSpan.className = 'field-error';
            inputElement.parentElement.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';

        // Add shake animation
        inputElement.classList.add('shake-anim');
        setTimeout(() => inputElement.classList.remove('shake-anim'), 400);

        return false;
    },

    /**
     * Clear error and set valid state
     */
    clearError(inputElement) {
        if (!inputElement) return true;
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        
        const errorSpan = inputElement.parentElement.querySelector('.field-error');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
        }
        return true;
    },

    /**
     * Validates that field contains strictly alphabets and spaces (NO numbers or special characters allowed)
     */
    validateAlphabetOnly(inputElement, fieldName = "This field") {
        const val = inputElement.value.trim();
        if (val === '') {
            return this.showError(inputElement, `${fieldName} is required.`);
        }
        if (/\d/.test(val)) {
            return this.showError(inputElement, `Numbers are NOT allowed in ${fieldName}! Only alphabets are permitted.`);
        }
        if (!this.regex.alphabetOnly.test(val)) {
            return this.showError(inputElement, `Special characters are NOT allowed! Only alphabets are permitted.`);
        }
        if (val.length < 2) {
            return this.showError(inputElement, `${fieldName} must be at least 2 characters long.`);
        }
        return this.clearError(inputElement);
    },

    /**
     * Validates that field contains strictly numeric digits (NO alphabets or special characters allowed)
     */
    validateNumberOnly(inputElement, fieldName = "This field", minLength = 1, maxLength = 20) {
        const rawVal = inputElement.value.trim();
        if (rawVal === '') {
            return this.showError(inputElement, `${fieldName} is required.`);
        }
        if (/[a-zA-Z]/.test(rawVal)) {
            return this.showError(inputElement, `Alphabets are NOT allowed in ${fieldName}! Only numbers are permitted.`);
        }
        if (!this.regex.numberOnly.test(rawVal)) {
            return this.showError(inputElement, `Special characters/spaces are NOT allowed! Only numbers are permitted.`);
        }
        if (rawVal.length < minLength) {
            return this.showError(inputElement, `${fieldName} must be at least ${minLength} digits.`);
        }
        if (rawVal.length > maxLength) {
            return this.showError(inputElement, `${fieldName} cannot exceed ${maxLength} digits.`);
        }
        return this.clearError(inputElement);
    },

    /**
     * Validates age (Numeric only, 1-120)
     */
    validateAge(inputElement) {
        const val = inputElement.value.trim();
        if (val === '') {
            return this.showError(inputElement, `Age is required.`);
        }
        if (/[a-zA-Z]/.test(val)) {
            return this.showError(inputElement, `Alphabets are NOT allowed in Age! Enter numbers only.`);
        }
        if (!this.regex.numberOnly.test(val)) {
            return this.showError(inputElement, `Only numeric age allowed.`);
        }
        const num = parseInt(val, 10);
        if (isNaN(num) || num < 1 || num > 120) {
            return this.showError(inputElement, `Age must be a valid number between 1 and 120.`);
        }
        return this.clearError(inputElement);
    },

    /**
     * Validates 10-digit Indian mobile number (Numeric only, starts with 6-9)
     */
    validatePhone(inputElement) {
        const val = inputElement.value.trim();
        if (val === '') {
            return this.showError(inputElement, `Mobile number is required.`);
        }
        if (/[a-zA-Z]/.test(val)) {
            return this.showError(inputElement, `Alphabets are NOT allowed in Mobile Number! Only numbers allowed.`);
        }
        if (!this.regex.numberOnly.test(val)) {
            return this.showError(inputElement, `Only numbers are allowed in mobile number.`);
        }
        if (val.length !== 10) {
            return this.showError(inputElement, `Mobile number must be exactly 10 digits.`);
        }
        if (!this.regex.phone.test(val)) {
            return this.showError(inputElement, `Mobile number must start with 6, 7, 8, or 9.`);
        }
        return this.clearError(inputElement);
    },

    /**
     * Validates Email format
     */
    validateEmail(inputElement) {
        const val = inputElement.value.trim();
        if (val === '') {
            return this.showError(inputElement, `Email address is required.`);
        }
        if (!this.regex.email.test(val)) {
            return this.showError(inputElement, `Please enter a valid email address (e.g. user@domain.com).`);
        }
        return this.clearError(inputElement);
    },

    /**
     * Validates Date of journey (Cannot be in the past)
     */
    validateDate(inputElement) {
        const val = inputElement.value;
        if (!val) {
            return this.showError(inputElement, `Journey date is required.`);
        }
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return this.showError(inputElement, `Journey date cannot be in the past.`);
        }

        // Limit to 120 days advance booking
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 120);
        if (selectedDate > maxDate) {
            return this.showError(inputElement, `Advance booking allowed only up to 120 days.`);
        }
        return this.clearError(inputElement);
    },

    /**
     * Validates Booking Time selection
     */
    validateTime(inputElement) {
        const val = inputElement.value;
        if (!val) {
            return this.showError(inputElement, `Please select preferred departure/booking time slot.`);
        }
        return this.clearError(inputElement);
    },

    /**
     * Validates Station Selection
     */
    validateStations(fromSelect, toSelect) {
        const from = fromSelect.value;
        const to = toSelect.value;
        
        let valid = true;
        if (!from) {
            this.showError(fromSelect, `Please select origin station.`);
            valid = false;
        } else {
            this.clearError(fromSelect);
        }

        if (!to) {
            this.showError(toSelect, `Please select destination station.`);
            valid = false;
        } else if (from && from === to) {
            this.showError(toSelect, `Origin and Destination stations cannot be the same!`);
            valid = false;
        } else {
            this.clearError(toSelect);
        }
        return valid;
    },

    /**
     * Live input guard for alphabet fields: blocks numbers & symbols on keystroke
     */
    attachAlphabetGuard(inputElement, fieldName = "This field") {
        inputElement.addEventListener('input', (e) => {
            const raw = inputElement.value;
            // Check if user attempted to input numbers
            if (/\d/.test(raw)) {
                this.showError(inputElement, `Numbers are NOT allowed in ${fieldName}! Only alphabets are permitted.`);
                // Clean the input to keep only alphabets and spaces
                inputElement.value = raw.replace(/[0-9]/g, '');
            } else if (/[^a-zA-Z\s]/.test(raw)) {
                this.showError(inputElement, `Special characters are NOT allowed in ${fieldName}!`);
                inputElement.value = raw.replace(/[^a-zA-Z\s]/g, '');
            } else {
                if (raw.trim().length >= 2) {
                    this.clearError(inputElement);
                }
            }
        });

        inputElement.addEventListener('blur', () => {
            if (inputElement.value.trim() !== '') {
                this.validateAlphabetOnly(inputElement, fieldName);
            }
        });
    },

    /**
     * Live input guard for number fields: blocks alphabets on keystroke
     */
    attachNumberGuard(inputElement, fieldName = "This field", maxDigits = 16) {
        inputElement.addEventListener('input', (e) => {
            const raw = inputElement.value;
            // Check if user attempted to input letters
            if (/[a-zA-Z]/.test(raw)) {
                this.showError(inputElement, `Alphabets are NOT allowed in ${fieldName}! Only numeric digits are permitted.`);
                // Clean the input to keep only digits
                inputElement.value = raw.replace(/[a-zA-Z]/g, '');
            } else if (/[^0-9]/.test(raw)) {
                this.showError(inputElement, `Special characters or spaces are NOT allowed in ${fieldName}!`);
                inputElement.value = raw.replace(/[^0-9]/g, '');
            } else {
                if (inputElement.value.length > maxDigits) {
                    inputElement.value = inputElement.value.slice(0, maxDigits);
                }
                this.clearError(inputElement);
            }
        });

        inputElement.addEventListener('blur', () => {
            if (inputElement.value.trim() !== '') {
                this.validateNumberOnly(inputElement, fieldName, 1, maxDigits);
            }
        });
    }
};

// Export to window
window.Validator = Validator;
