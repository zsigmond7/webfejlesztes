// Űrlap validációs szabályok és függvények
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const fanLevelInput = document.getElementById('fanLevel');
    const fanLevelValue = document.getElementById('fanLevelValue');

    // Range slider érték megjelenítése
    if (fanLevelInput) {
        fanLevelInput.addEventListener('input', function() {
            fanLevelValue.textContent = this.value;
        });
    }

    // Validációs függvények
    const validators = {
        firstName: function(value) {
            if (value.trim().length < 2) {
                return 'A keresztnévnek legalább 2 karakter hosszúnak kell lennie';
            }
            return '';
        },

        lastName: function(value) {
            if (value.trim().length < 2) {
                return 'A vezetéknévnek legalább 2 karakter hosszúnak kell lennie';
            }
            return '';
        },

        email: function(value) {
            if (!value.includes('@') || !value.includes('.')) {
                return 'Kérjük, adjon meg egy érvényes e-mail címet';
            }
            if (value.indexOf('@') === 0) {
                return 'Az email cím nem kezdődhet @ jellel';
            }
            if (value.lastIndexOf('.') < value.indexOf('@')) {
                return 'A pontnak a @ jel után kell lennie';
            }
            return '';
        },

        phone: function(value) {
            if (value.trim() === '') return '';
            
            if (value.trim().length < 10) {
                return 'A telefonszám túl rövid';
            }
            return '';
        },

        birthDate: function(value) {
            if (value.trim() === '') return ''; 
            const selectedDate = new Date(value);
            const today = new Date();
            const minDate = new Date('1900-01-01');
            
            if (selectedDate > today) {
                return 'A születési dátum nem lehet jövőbeli';
            }
            if (selectedDate < minDate) {
                return 'Kérjük, adjon meg egy érvényes dátumot';
            }
            return '';
        },

        interest: function(value) {
            if (value === '') {
                return 'Kérjük, válasszon egy érdeklődési területet';
            }
            return '';
        },

        message: function(value) {
            if (value.trim().length < 10) {
                return 'Az üzenetnek legalább 10 karakter hosszúnak kell lennie';
            }
            if (value.trim().length > 1000) {
                return 'Az üzenet maximum 1000 karakter hosszú lehet';
            }
            return '';
        },

        terms: function(checked) {
            if (!checked) {
                return 'Az adatvédelmi feltételek elfogadása kötelező';
            }
            return '';
        }
    };


    function validateField(fieldName, value, isCheckbox = false) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);
        
        if (!validators[fieldName]) return true;

        const errorMessage = validators[fieldName](isCheckbox ? value : value.trim());
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        if (inputElement) {
            if (errorMessage) {
                inputElement.classList.remove('success');
                inputElement.classList.add('error');
                return false;
            } else {
                inputElement.classList.remove('error');
                inputElement.classList.add('success');
                return true;
            }
        }

        return errorMessage === '';
    }

 
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'interest', 'message'];
    
    fieldsToValidate.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            // Blur esemény (mezőről való kilépés)
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });

            // Input esemény (gépelés közben)
            field.addEventListener('input', function() {
                // Csak akkor validálunk gépelés közben, ha már volt hiba
                if (this.classList.contains('error')) {
                    validateField(fieldName, this.value);
                }
            });
        }
    });

    // Checkbox validálás
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            validateField('terms', this.checked, true);
        });
    }

    // Űrlap beküldése
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Összes mező validálása
            let isValid = true;

            fieldsToValidate.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field && !validateField(fieldName, field.value)) {
                    isValid = false;
                }
            });

            // Terms checkbox validálás
            if (termsCheckbox && !validateField('terms', termsCheckbox.checked, true)) {
                isValid = false;
            }

            // Ha minden mező valid, akkor "beküldés"
            if (isValid) {
                // Űrlap elrejtése
                form.style.display = 'none';
                
                // Sikeres üzenet megjelenítése
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.style.display = 'block';
                }

                // Görgetés a sikeres üzenethez
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Konzolra kiírjuk az adatokat (teszteléshez)
                console.log('Űrlap adatok:');
                console.log('Keresztnév:', document.getElementById('firstName').value);
                console.log('Vezetéknév:', document.getElementById('lastName').value);
                console.log('E-mail:', document.getElementById('email').value);
                console.log('Telefon:', document.getElementById('phone').value);
                console.log('Születési dátum:', document.getElementById('birthDate').value);
                console.log('Érdeklődés:', document.getElementById('interest').value);
                console.log('Rajongói szint:', fanLevelInput.value);
                console.log('Üzenet:', document.getElementById('message').value);
                console.log('Hírlevél:', document.getElementById('newsletter').checked);
                console.log('Feltételek elfogadva:', termsCheckbox.checked);
            } else {
                // Görgetés az első hibás mezőhöz
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });

        // Reset gomb kezelése
        form.addEventListener('reset', function() {
            // Kis késleltetés után törölni az összes error/success osztályt
            setTimeout(function() {
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.classList.remove('error', 'success');
                });

                const errorMessages = form.querySelectorAll('.error-message');
                errorMessages.forEach(msg => {
                    msg.textContent = '';
                });

                // Range slider visszaállítása
                if (fanLevelInput && fanLevelValue) {
                    fanLevelValue.textContent = '5';
                }
            }, 10);
        });
    }
});