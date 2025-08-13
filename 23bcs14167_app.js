// Student Registration Form JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const successMessage = document.getElementById('successMessage');

    const errorMessages = {
        firstName: {
            required: 'First name is required',
            pattern: 'First name should contain only letters and spaces',
            minlength: 'First name must be at least 2 characters long',
            maxlength: 'First name must not exceed 50 characters'
        },
        lastName: {
            required: 'Last name is required',
            pattern: 'Last name should contain only letters and spaces',
            minlength: 'Last name must be at least 2 characters long',
            maxlength: 'Last name must not exceed 50 characters'
        },
        email: {
            required: 'Email address is required',
            pattern: 'Please enter a valid email address'
        },
        phone: {
            required: 'Phone number is required',
            pattern: 'Phone number must be in format 123-456-7890'
        },
        dateOfBirth: {
            required: 'Date of birth is required',
            age: 'You must be at least 14 years old to register'
        },
        studentId: {
            pattern: 'Student ID must be in format: 2 letters + 6 numbers (e.g., AB123456)'
        },
        gender: {
            required: 'Please select your gender'
        },
        program: {
            required: 'Please select your program of study'
        },
        academicYear: {
            required: 'Please select your academic year'
        },
        gpa: {
            min: 'GPA must be at least 0.0',
            max: 'GPA cannot exceed 4.0'
        },
        address: {
            required: 'Street address is required',
            minlength: 'Address must be at least 10 characters long',
            maxlength: 'Address must not exceed 200 characters'
        },
        emergencyName: {
            required: 'Emergency contact name is required',
            pattern: 'Emergency contact name should contain only letters and spaces'
        },
        emergencyPhone: {
            required: 'Emergency contact phone is required',
            pattern: 'Emergency contact phone must be in format 123-456-7890'
        },
        terms: {
            required: 'You must agree to the terms and conditions'
        }
    };

    // Initialize form
    function initializeForm() {
        setupInputs();
        setupPhoneFormatting();
        setMaxDate();
        attachEventListeners();
        setupCustomControls();
    }

    // Ensure all inputs work properly
    function setupInputs() {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Remove any attributes that might block input
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            
            // Ensure inputs are interactive
            input.style.pointerEvents = 'auto';
            input.style.userSelect = 'text';
            input.tabIndex = 0;
            
            // Force focus capability
            input.addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
            
            input.addEventListener('click', function(e) {
                e.stopPropagation();
                this.focus();
            });
        });
    }

    // Setup phone number formatting
    function setupPhoneFormatting() {
        const phoneFields = ['phone', 'emergencyPhone'];
        phoneFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', function(e) {
                    formatPhoneNumber(e.target);
                });
                
                field.addEventListener('keypress', function(e) {
                    // Only allow numbers, backspace, delete, and arrow keys
                    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','Backspace','Delete','ArrowLeft','ArrowRight','Tab'];
                    if (!allowedKeys.includes(e.key)) {
                        e.preventDefault();
                    }
                });
            }
        });
    }

    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            if (value.length <= 3) {
                formattedValue = value;
            } else if (value.length <= 6) {
                formattedValue = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                formattedValue = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
            }
        }
        
        input.value = formattedValue;
    }

    // Set maximum date for age validation
    function setMaxDate() {
        const dateInput = document.getElementById('dateOfBirth');
        if (dateInput) {
            const today = new Date();
            const maxDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
            dateInput.max = maxDate.toISOString().split('T')[0];
        }
    }

    // Setup custom radio and checkbox controls
    function setupCustomControls() {
        // Radio buttons
        document.querySelectorAll('.radio-label').forEach(label => {
            label.addEventListener('click', function(e) {
                if (e.target === this || e.target.classList.contains('radio-custom')) {
                    const radio = this.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change'));
                        clearRadioErrors(radio.name);
                    }
                }
            });
            
            label.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Checkboxes
        document.querySelectorAll('.checkbox-label').forEach(label => {
            label.addEventListener('click', function(e) {
                if (e.target === this || e.target.classList.contains('checkbox-custom')) {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                        validateField(checkbox);
                    }
                }
            });
            
            label.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Attach all event listeners
    function attachEventListeners() {
        // Form submission
        form.addEventListener('submit', handleSubmit);
        
        // Reset button
        resetBtn.addEventListener('click', handleReset);
        
        // Input validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });

        // Radio group validation
        form.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                clearRadioErrors(this.name);
            });
        });
    }

    // Validation functions
    function validateField(field) {
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
            case 'emergencyName':
                isValid = validateName(field);
                break;
            case 'email':
                isValid = validateEmail(field);
                break;
            case 'phone':
            case 'emergencyPhone':
                isValid = validatePhone(field);
                break;
            case 'dateOfBirth':
                isValid = validateAge(field);
                break;
            case 'studentId':
                isValid = validateStudentId(field);
                break;
            case 'program':
            case 'academicYear':
                isValid = validateSelect(field);
                break;
            case 'gpa':
                isValid = validateGPA(field);
                break;
            case 'address':
                isValid = validateAddress(field);
                break;
            case 'terms':
                isValid = validateTerms(field);
                break;
        }

        return isValid;
    }

    function validateName(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        if (!value && field.required) {
            showFieldError(field, errorMessages[fieldName].required);
            return false;
        }
        
        if (value) {
            if (value.length < 2) {
                showFieldError(field, errorMessages[fieldName].minlength);
                return false;
            }
            if (value.length > 50) {
                showFieldError(field, errorMessages[fieldName].maxlength);
                return false;
            }
            if (!/^[A-Za-z\s]+$/.test(value)) {
                showFieldError(field, errorMessages[fieldName].pattern);
                return false;
            }
        }
        
        showFieldSuccess(field);
        return true;
    }

    function validateEmail(field) {
        const value = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value && field.required) {
            showFieldError(field, errorMessages.email.required);
            return false;
        }
        
        if (value && !emailRegex.test(value)) {
            showFieldError(field, errorMessages.email.pattern);
            return false;
        }
        
        showFieldSuccess(field);
        return true;
    }

    function validatePhone(field) {
        const value = field.value.trim();
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        const fieldName = field.name || field.id;
        
        if (!value && field.required) {
            showFieldError(field, errorMessages[fieldName].required);
            return false;
        }
        
        if (value && !phoneRegex.test(value)) {
            showFieldError(field, errorMessages[fieldName].pattern);
            return false;
        }
        
        showFieldSuccess(field);
        return true;
    }

    function validateAge(field) {
        const value = field.value;
        
        if (!value && field.required) {
            showFieldError(field, errorMessages.dateOfBirth.required);
            return false;
        }
        
        if (value) {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 14) {
                showFieldError(field, errorMessages.dateOfBirth.age);
                return false;
            }
        }
        
        showFieldSuccess(field);
        return true;
    }

    function validateStudentId(field) {
        const value = field.value.trim();
        const studentIdRegex = /^[A-Za-z]{2}\d{6}$/;
        
        if (value && !studentIdRegex.test(value)) {
            showFieldError(field, errorMessages.studentId.pattern);
            return false;
        }
        
        if (value) {
            showFieldSuccess(field);
        } else {
            clearFieldError(field);
        }
        return true;
    }

    function validateSelect(field) {
        const value = field.value;
        const fieldName = field.name || field.id;
        
        if (!value && field.required) {
            showFieldError(field, errorMessages[fieldName].required);
            return false;
        }
        
        showFieldSuccess(field);
        return true;
    }

    function validateGPA(field) {
        const value = field.value;
        
        if (value) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0.0 || numValue > 4.0) {
                if (numValue < 0.0) {
                    showFieldError(field, errorMessages.gpa.min);
                } else {
                    showFieldError(field, errorMessages.gpa.max);
                }
                return false;
            }
            showFieldSuccess(field);
        } else {
            clearFieldError(field);
        }
        return true;
    }

    function validateAddress(field) {
        const value = field.value.trim();
        
        if (!value && field.required) {
            showFieldError(field, errorMessages.address.required);
            return false;
        }
        
        if (value) {
            if (value.length < 10) {
                showFieldError(field, errorMessages.address.minlength);
                return false;
            }
            if (value.length > 200) {
                showFieldError(field, errorMessages.address.maxlength);
                return false;
            }
        }
        
        showFieldSuccess(field);
        return true;
    }

    function validateTerms(field) {
        if (!field.checked && field.required) {
            showFieldError(field, errorMessages.terms.required);
            return false;
        }
        
        clearFieldError(field);
        return true;
    }

    function validateRadioGroup(groupName) {
        const radios = form.querySelectorAll(`input[name="${groupName}"]`);
        const checked = Array.from(radios).some(radio => radio.checked);
        
        if (!checked) {
            showRadioError(groupName, errorMessages[groupName].required);
            return false;
        }
        
        clearRadioErrors(groupName);
        return true;
    }

    // Error display functions
    function showFieldError(field, message) {
        const fieldName = field.name || field.id;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        field.classList.add('error');
        field.classList.remove('success');
    }

    function showFieldSuccess(field) {
        const fieldName = field.name || field.id;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        field.classList.remove('error');
        field.classList.add('success');
    }

    function clearFieldError(field) {
        const fieldName = field.name || field.id;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        field.classList.remove('error', 'success');
    }

    function showRadioError(groupName, message) {
        const errorElement = document.getElementById(`${groupName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        const radios = form.querySelectorAll(`input[name="${groupName}"]`);
        radios.forEach(radio => {
            const label = radio.closest('.radio-label');
            if (label) {
                label.style.borderColor = 'var(--color-error)';
            }
        });
    }

    function clearRadioErrors(groupName) {
        const errorElement = document.getElementById(`${groupName}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        const radios = form.querySelectorAll(`input[name="${groupName}"]`);
        radios.forEach(radio => {
            const label = radio.closest('.radio-label');
            if (label) {
                label.style.borderColor = '';
            }
        });
    }

    // Form handling functions
    function handleSubmit(e) {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        let isValid = true;
        let firstInvalidField = null;
        
        // Validate all input fields
        const fields = form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });
        
        // Validate radio groups
        if (!validateRadioGroup('gender')) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = form.querySelector('input[name="gender"]');
            }
        }
        
        // Validate terms checkbox
        const termsCheckbox = form.querySelector('#terms');
        if (termsCheckbox && !validateField(termsCheckbox)) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = termsCheckbox;
            }
        }
        
        if (isValid) {
            // Show success after delay
            setTimeout(() => {
                showSuccessMessage();
            }, 1500);
        } else {
            // Focus first invalid field
            if (firstInvalidField) {
                firstInvalidField.focus();
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Registration';
        }
    }

    function handleReset(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
            resetForm();
        }
    }

    function resetForm() {
        // Reset form fields
        form.reset();
        
        // Clear all error messages
        form.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        // Remove all validation classes
        form.querySelectorAll('.form-control').forEach(el => {
            el.classList.remove('error', 'success');
        });
        
        // Reset custom control styling
        form.querySelectorAll('.radio-label, .checkbox-label').forEach(label => {
            label.style.borderColor = '';
        });
        
        // Hide success message and show form
        successMessage.classList.add('hidden');
        form.style.display = 'block';
        
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Registration';
        
        // Focus first field
        setTimeout(() => {
            const firstField = form.querySelector('input');
            if (firstField) {
                firstField.focus();
            }
        }, 100);
    }

    function showSuccessMessage() {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add new registration button if not already present
        const successContent = successMessage.querySelector('.success-content');
        if (!successContent.querySelector('.new-registration-btn')) {
            const newRegBtn = document.createElement('button');
            newRegBtn.className = 'btn btn--secondary new-registration-btn';
            newRegBtn.textContent = 'Register Another Student';
            newRegBtn.style.marginTop = 'var(--space-16)';
            newRegBtn.addEventListener('click', () => {
                successMessage.classList.add('hidden');
                form.style.display = 'block';
                resetForm();
            });
            successContent.appendChild(newRegBtn);
        }
    }

    // Initialize the form
    initializeForm();
});