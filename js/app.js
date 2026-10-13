/**
 * RailExpress - Core Application Script
 * Manages Multi-Step Navigation, Booking Flow, State, and Ticket Generation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    const state = {
        currentStep: 1,
        currentUser: null,
        journey: {
            fromStation: 'NDLS',
            toStation: 'MMCT',
            journeyDate: '',
            bookingTime: '06:00 AM - 12:00 PM',
            travelQuota: 'General'
        },
        passengers: [
            { id: 1, name: 'Manikandan', age: '24', gender: 'Male', berth: 'Lower' }
        ],
        contact: {
            phone: '9876543210',
            email: 'traveler@example.com'
        },
        selectedTrain: null,
        selectedClass: null,
        payment: {
            method: 'card',
            cardName: '',
            cardNumber: '',
            expiryMonth: '12',
            expiryYear: '2028',
            cvv: '',
            upiId: ''
        },
        bookingResult: null
    };

    // DOM Elements
    const elements = {
        // Steps
        stepContainers: document.querySelectorAll('.booking-step-container'),
        stepItems: document.querySelectorAll('.step-item'),
        stepperProgressLine: document.getElementById('stepperProgressLine'),
        userStatusBar: document.getElementById('userStatusBar'),
        activeUserDisplay: document.getElementById('activeUserDisplay'),
        btnSignout: document.getElementById('btnSignout'),

        // Step 1: Login
        authForm: document.getElementById('authForm'),
        loginUser: document.getElementById('loginUser'),
        loginPass: document.getElementById('loginPass'),
        demoLoginBtn: document.getElementById('demoLoginBtn'),
        authTabLogin: document.getElementById('authTabLogin'),
        authTabRegister: document.getElementById('authTabRegister'),
        authSubmitBtn: document.getElementById('authSubmitBtn'),

        // Step 2: Journey & Passenger Info
        journeyForm: document.getElementById('journeyForm'),
        fromStationSelect: document.getElementById('fromStation'),
        toStationSelect: document.getElementById('toStation'),
        swapStationsBtn: document.getElementById('swapStationsBtn'),
        journeyDateInput: document.getElementById('journeyDate'),
        bookingTimeSelect: document.getElementById('bookingTime'),
        travelQuotaSelect: document.getElementById('travelQuota'),
        passengerContainer: document.getElementById('passengerListContainer'),
        addPassengerBtn: document.getElementById('addPassengerBtn'),
        contactPhoneInput: document.getElementById('contactPhone'),
        contactEmailInput: document.getElementById('contactEmail'),
        btnJourneyNext: document.getElementById('btnJourneyNext'),

        // Step 3: Trains List
        trainsListContainer: document.getElementById('trainsListContainer'),
        routeSummaryFrom: document.getElementById('routeSummaryFrom'),
        routeSummaryTo: document.getElementById('routeSummaryTo'),
        routeSummaryDate: document.getElementById('routeSummaryDate'),
        btnTrainsBack: document.getElementById('btnTrainsBack'),
        btnTrainsNext: document.getElementById('btnTrainsNext'),

        // Step 4: Payment
        paymentMethods: document.querySelectorAll('.payment-method-btn'),
        cardPaymentFields: document.getElementById('cardPaymentFields'),
        demoCardBtn: document.getElementById('demoCardBtn'),
        upiPaymentFields: document.getElementById('upiPaymentFields'),
        netBankingFields: document.getElementById('netBankingFields'),
        cardholderNameInput: document.getElementById('cardholderName'),
        cardNumberInput: document.getElementById('cardNumber'),
        cardCvvInput: document.getElementById('cardCvv'),
        previewCardHolder: document.getElementById('previewCardHolder'),
        previewCardNumber: document.getElementById('previewCardNumber'),
        previewCardExpiry: document.getElementById('previewCardExpiry'),
        cardExpiryMonth: document.getElementById('cardExpiryMonth'),
        cardExpiryYear: document.getElementById('cardExpiryYear'),
        upiIdInput: document.getElementById('upiId'),
        btnProcessPayment: document.getElementById('btnProcessPayment'),
        btnPaymentBack: document.getElementById('btnPaymentBack'),
        
        // Summary Card elements
        summaryTrainName: document.getElementById('summaryTrainName'),
        summaryRoute: document.getElementById('summaryRoute'),
        summaryDate: document.getElementById('summaryDate'),
        summaryPassengersCount: document.getElementById('summaryPassengersCount'),
        summaryClass: document.getElementById('summaryClass'),
        summaryBaseFare: document.getElementById('summaryBaseFare'),
        summaryTax: document.getElementById('summaryTax'),
        summaryTotalAmount: document.getElementById('summaryTotalAmount'),

        // Step 5: Confirmation Ticket
        confirmedTicketCard: document.getElementById('confirmedTicketCard'),
        ticketPnr: document.getElementById('ticketPnr'),
        ticketTrainName: document.getElementById('ticketTrainName'),
        ticketTrainNumber: document.getElementById('ticketTrainNumber'),
        ticketFromStation: document.getElementById('ticketFromStation'),
        ticketToStation: document.getElementById('ticketToStation'),
        ticketDepartureTime: document.getElementById('ticketDepartureTime'),
        ticketArrivalTime: document.getElementById('ticketArrivalTime'),
        ticketJourneyDate: document.getElementById('ticketJourneyDate'),
        ticketClassQuota: document.getElementById('ticketClassQuota'),
        ticketPassengersTableBody: document.getElementById('ticketPassengersTableBody'),
        ticketTotalFare: document.getElementById('ticketTotalFare'),
        ticketBarcodeText: document.getElementById('ticketBarcodeText'),
        btnPrintTicket: document.getElementById('btnPrintTicket'),
        btnDownloadTicket: document.getElementById('btnDownloadTicket'),
        btnBookAnother: document.getElementById('btnBookAnother'),

        // Toast Container
        toastContainer: document.getElementById('toastContainer')
    };

    // =========================================================================
    // Toast Notification System
    // =========================================================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';

        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // =========================================================================
    // Step Navigation Manager
    // =========================================================================
    function navigateToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > 5) return;
        state.currentStep = stepNumber;

        // Update view containers
        elements.stepContainers.forEach(container => {
            container.classList.remove('active-step');
            if (parseInt(container.dataset.step) === stepNumber) {
                container.classList.add('active-step');
            }
        });

        // Update stepper progress
        elements.stepItems.forEach((item, index) => {
            const itemStep = index + 1;
            item.classList.remove('active', 'completed');
            if (itemStep === stepNumber) {
                item.classList.add('active');
            } else if (itemStep < stepNumber) {
                item.classList.add('completed');
            }
        });

        // Update progress bar line width
        const percentage = ((stepNumber - 1) / (elements.stepItems.length - 1)) * 100;
        elements.stepperProgressLine.style.width = `${percentage}%`;

        // Scroll to top of viewport smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // =========================================================================
    // STEP 1: Authentication & Login
    // =========================================================================
    // Attach guards to login fields
    Validator.attachAlphabetGuard(elements.loginUser, 'Username');

    // Demo login autofill
    if (elements.demoLoginBtn) {
        elements.demoLoginBtn.addEventListener('click', () => {
            elements.loginUser.value = 'Manikandan';
            elements.loginPass.value = 'Rail@2026';
            Validator.clearError(elements.loginUser);
            Validator.clearError(elements.loginPass);
            showToast('Demo credentials populated!', 'info');
        });
    }

    // Switch between Sign In and Register tabs
    let isRegisterMode = false;
    elements.authTabLogin.addEventListener('click', () => {
        isRegisterMode = false;
        elements.authTabLogin.classList.add('active');
        elements.authTabRegister.classList.remove('active');
        elements.authSubmitBtn.textContent = 'Sign In to Book Ticket';
    });

    elements.authTabRegister.addEventListener('click', () => {
        isRegisterMode = true;
        elements.authTabRegister.classList.add('active');
        elements.authTabLogin.classList.remove('active');
        elements.authSubmitBtn.textContent = 'Create Account & Continue';
    });

    elements.authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isUserValid = Validator.validateAlphabetOnly(elements.loginUser, 'Username');
        let isPassValid = true;

        if (elements.loginPass.value.trim().length < 4) {
            Validator.showError(elements.loginPass, 'Password must be at least 4 characters long.');
            isPassValid = false;
        } else {
            Validator.clearError(elements.loginPass);
        }

        if (!isUserValid || !isPassValid) {
            showToast('Please correct errors before proceeding.', 'error');
            return;
        }

        // Authenticated successfully
        state.currentUser = elements.loginUser.value.trim();
        elements.activeUserDisplay.textContent = state.currentUser;
        elements.userStatusBar.style.display = 'flex';

        showToast(`Welcome aboard, ${state.currentUser}!`, 'success');
        
        // Auto-fill passenger #1 name with the logged-in user
        if (state.passengers.length > 0) {
            state.passengers[0].name = state.currentUser;
            renderPassengers();
        }

        navigateToStep(2);
    });

    // Sign out button
    elements.btnSignout.addEventListener('click', () => {
        state.currentUser = null;
        elements.userStatusBar.style.display = 'none';
        elements.authForm.reset();
        showToast('Logged out successfully.', 'info');
        navigateToStep(1);
    });

    // =========================================================================
    // STEP 2: Station Population, Journey, & Passenger Management
    // =========================================================================
    function populateStations() {
        elements.fromStationSelect.innerHTML = '<option value="">Select Origin Station</option>';
        elements.toStationSelect.innerHTML = '<option value="">Select Destination Station</option>';

        window.STATIONS_LIST.forEach(stn => {
            const optFrom = document.createElement('option');
            optFrom.value = stn.code;
            optFrom.textContent = `${stn.name} (${stn.code}) - ${stn.state}`;
            elements.fromStationSelect.appendChild(optFrom);

            const optTo = document.createElement('option');
            optTo.value = stn.code;
            optTo.textContent = `${stn.name} (${stn.code}) - ${stn.state}`;
            elements.toStationSelect.appendChild(optTo);
        });

        // Set defaults: New Delhi -> Mumbai Central
        elements.fromStationSelect.value = 'NDLS';
        elements.toStationSelect.value = 'MMCT';

        // Set default journey date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const defaultDateStr = `${yyyy}-${mm}-${dd}`;
        elements.journeyDateInput.min = defaultDateStr;
        elements.journeyDateInput.value = defaultDateStr;
        state.journey.journeyDate = defaultDateStr;
    }

    populateStations();

    // Swap Stations
    elements.swapStationsBtn.addEventListener('click', () => {
        const temp = elements.fromStationSelect.value;
        elements.fromStationSelect.value = elements.toStationSelect.value;
        elements.toStationSelect.value = temp;
        Validator.validateStations(elements.fromStationSelect, elements.toStationSelect);
    });

    // Dynamic Passenger Rendering
    function renderPassengers() {
        elements.passengerContainer.innerHTML = '';

        state.passengers.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'passenger-card';
            card.dataset.id = p.id;

            card.innerHTML = `
                <div class="passenger-card-header">
                    <span class="passenger-title">👤 Passenger #${index + 1}</span>
                    ${state.passengers.length > 1 ? `<button type="button" class="btn-remove-passenger" data-index="${index}">✕ Remove</button>` : ''}
                </div>
                <div class="grid-4">
                    <div class="form-group">
                        <label class="form-label">Full Name <span class="required">*</span></label>
                        <input type="text" class="form-control passenger-name" placeholder="Letters only (e.g. John Doe)" value="${p.name || ''}" data-index="${index}">
                        <span class="helper-text badge-rule">🔤 Alphabet only</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Age <span class="required">*</span></label>
                        <input type="text" class="form-control passenger-age" placeholder="Digits only (e.g. 28)" value="${p.age || ''}" maxlength="3" data-index="${index}">
                        <span class="helper-text badge-rule">🔢 Number only</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Gender <span class="required">*</span></label>
                        <select class="form-control passenger-gender" data-index="${index}">
                            <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Transgender" ${p.gender === 'Transgender' ? 'selected' : ''}>Transgender</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Berth Preference</label>
                        <select class="form-control passenger-berth" data-index="${index}">
                            <option value="No Preference" ${p.berth === 'No Preference' ? 'selected' : ''}>No Preference</option>
                            <option value="Lower" ${p.berth === 'Lower' ? 'selected' : ''}>Lower Berth</option>
                            <option value="Middle" ${p.berth === 'Middle' ? 'selected' : ''}>Middle Berth</option>
                            <option value="Upper" ${p.berth === 'Upper' ? 'selected' : ''}>Upper Berth</option>
                            <option value="Side Lower" ${p.berth === 'Side Lower' ? 'selected' : ''}>Side Lower</option>
                            <option value="Side Upper" ${p.berth === 'Side Upper' ? 'selected' : ''}>Side Upper</option>
                            <option value="Window" ${p.berth === 'Window' ? 'selected' : ''}>Window Seat</option>
                        </select>
                    </div>
                </div>
            `;

            elements.passengerContainer.appendChild(card);
        });

        // Attach strict guards & event listeners to all passenger inputs
        document.querySelectorAll('.passenger-name').forEach(nameInput => {
            Validator.attachAlphabetGuard(nameInput, 'Passenger Name');
            nameInput.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index);
                state.passengers[idx].name = e.target.value;
            });
        });

        document.querySelectorAll('.passenger-age').forEach(ageInput => {
            Validator.attachNumberGuard(ageInput, 'Age', 3);
            ageInput.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index);
                state.passengers[idx].age = e.target.value;
            });
        });

        document.querySelectorAll('.passenger-gender').forEach(genderSelect => {
            genderSelect.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index);
                state.passengers[idx].gender = e.target.value;
            });
        });

        document.querySelectorAll('.passenger-berth').forEach(berthSelect => {
            berthSelect.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index);
                state.passengers[idx].berth = e.target.value;
            });
        });

        // Remove passenger button listeners
        document.querySelectorAll('.btn-remove-passenger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                state.passengers.splice(idx, 1);
                renderPassengers();
                showToast('Passenger removed.', 'info');
            });
        });
    }

    renderPassengers();

    // Add Passenger Button
    elements.addPassengerBtn.addEventListener('click', () => {
        if (state.passengers.length >= 6) {
            showToast('Maximum 6 passengers allowed per booking.', 'error');
            return;
        }
        state.passengers.push({
            id: Date.now(),
            name: '',
            age: '',
            gender: 'Male',
            berth: 'No Preference'
        });
        renderPassengers();
    });

    // Attach guards to contact details
    Validator.attachNumberGuard(elements.contactPhoneInput, 'Mobile Number', 10);

    // Step 2 Submission & Validation
    elements.journeyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Validate stations
        const stationsValid = Validator.validateStations(elements.fromStationSelect, elements.toStationSelect);

        // 2. Validate date and time
        const dateValid = Validator.validateDate(elements.journeyDateInput);
        const timeValid = Validator.validateTime(elements.bookingTimeSelect);

        // 3. Validate contact info
        const phoneValid = Validator.validatePhone(elements.contactPhoneInput);
        const emailValid = Validator.validateEmail(elements.contactEmailInput);

        // 4. Validate all passenger inputs
        let passengersValid = true;
        const nameInputs = document.querySelectorAll('.passenger-name');
        const ageInputs = document.querySelectorAll('.passenger-age');

        nameInputs.forEach(input => {
            if (!Validator.validateAlphabetOnly(input, 'Passenger Name')) {
                passengersValid = false;
            }
        });

        ageInputs.forEach(input => {
            if (!Validator.validateAge(input)) {
                passengersValid = false;
            }
        });

        if (!stationsValid || !dateValid || !timeValid || !phoneValid || !emailValid || !passengersValid) {
            showToast('Please fix all form validation errors before continuing.', 'error');
            return;
        }

        // Save Journey Details
        state.journey.fromStation = elements.fromStationSelect.value;
        state.journey.toStation = elements.toStationSelect.value;
        state.journey.journeyDate = elements.journeyDateInput.value;
        state.journey.bookingTime = elements.bookingTimeSelect.value;
        state.journey.travelQuota = elements.travelQuotaSelect.value;

        // Save Contact Details
        state.contact.phone = elements.contactPhoneInput.value.trim();
        state.contact.email = elements.contactEmailInput.value.trim();

        // Load Trains for Step 3
        loadAvailableTrains();
        navigateToStep(3);
    });

    // =========================================================================
    // STEP 3: Trains Search & Class Selection
    // =========================================================================
    function getStationName(code) {
        const stn = window.STATIONS_LIST.find(s => s.code === code);
        return stn ? stn.name : code;
    }

    function loadAvailableTrains() {
        const fromName = getStationName(state.journey.fromStation);
        const toName = getStationName(state.journey.toStation);

        elements.routeSummaryFrom.textContent = `${fromName} (${state.journey.fromStation})`;
        elements.routeSummaryTo.textContent = `${toName} (${state.journey.toStation})`;
        elements.routeSummaryDate.textContent = `📅 ${state.journey.journeyDate} | Slot: ${state.journey.bookingTime}`;

        // Filter trains or provide high-speed bullet options
        let matchedTrains = window.TRAIN_DATABASE.filter(t => 
            t.from.includes(state.journey.fromStation) && t.to.includes(state.journey.toStation)
        );

        // If no exact match on routes, show premier high speed trains with updated route for seamless booking
        if (matchedTrains.length === 0) {
            matchedTrains = window.TRAIN_DATABASE.slice(0, 4).map(t => ({
                ...t,
                from: `${fromName} (${state.journey.fromStation})`,
                to: `${toName} (${state.journey.toStation})`
            }));
        }

        elements.trainsListContainer.innerHTML = '';
        state.selectedTrain = null;
        state.selectedClass = null;
        elements.btnTrainsNext.disabled = true;

        matchedTrains.forEach(train => {
            const trainCard = document.createElement('div');
            trainCard.className = 'train-card';
            trainCard.dataset.trainId = train.id;

            trainCard.innerHTML = `
                <div class="train-header">
                    <div class="train-name-box">
                        <h4>🚄 ${train.name} <span class="train-number-tag">#${train.number}</span></h4>
                        <div class="train-type-text">${train.type} • Speed: ${train.speed} • Runs on: ${train.availableDays.join(', ')}</div>
                    </div>
                    <span class="train-tag-badge">${train.badge}</span>
                </div>

                <div class="train-timeline">
                    <div class="time-station">
                        <div class="time-value">${train.departure}</div>
                        <div class="station-label">${train.from}</div>
                    </div>
                    <div class="duration-line-box">
                        <span class="duration-text">⏱️ ${train.duration}</span>
                        <div class="track-line"></div>
                        <span class="duration-text" style="color: #10b981; font-size: 0.72rem;">${train.punctuality} On-Time</span>
                    </div>
                    <div class="time-station dest">
                        <div class="time-value">${train.arrival}</div>
                        <div class="station-label">${train.to}</div>
                    </div>
                </div>

                <div class="train-classes-grid">
                    ${train.classes.map(cls => `
                        <div class="class-card" data-train-id="${train.id}" data-class-code="${cls.code}" data-price="${cls.price}">
                            <div class="class-header">
                                <span class="class-code">${cls.code}</span>
                                <span class="class-price">₹${cls.price}</span>
                            </div>
                            <div class="class-name">${cls.name}</div>
                            <span class="class-availability">🟢 ${cls.status} (${cls.available})</span>
                        </div>
                    `).join('')}
                </div>
            `;

            elements.trainsListContainer.appendChild(trainCard);
        });

        // Add class selection handlers
        document.querySelectorAll('.class-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.class-card').forEach(c => c.classList.remove('active-class'));
                document.querySelectorAll('.train-card').forEach(tc => tc.classList.remove('selected-train'));

                card.classList.add('active-class');
                const parentTrainCard = card.closest('.train-card');
                parentTrainCard.classList.add('selected-train');

                const trainId = card.dataset.trainId;
                const classCode = card.dataset.classCode;
                const price = parseInt(card.dataset.price);

                const trainObj = matchedTrains.find(t => t.id === trainId);
                const classObj = trainObj.classes.find(c => c.code === classCode);

                state.selectedTrain = trainObj;
                state.selectedClass = classObj;

                elements.btnTrainsNext.disabled = false;
                showToast(`Selected ${trainObj.name} - Class ${classObj.name} (₹${price}/passenger)`, 'info');
            });
        });
    }

    elements.btnTrainsBack.addEventListener('click', () => navigateToStep(2));

    elements.btnTrainsNext.addEventListener('click', () => {
        if (!state.selectedTrain || !state.selectedClass) {
            showToast('Please select a train and coach class to continue.', 'error');
            return;
        }
        setupPaymentView();
        navigateToStep(4);
    });

    // =========================================================================
    // STEP 4: Payment Details & Order Summary
    // =========================================================================
    function setupPaymentView() {
        const passengerCount = state.passengers.length;
        const baseFare = state.selectedClass.price * passengerCount;
        const convenienceFee = 150;
        const gst = Math.round(baseFare * 0.05); // 5% GST on AC travel
        const grandTotal = baseFare + convenienceFee + gst;

        state.payment.totalAmount = grandTotal;

        // Update Order Summary
        elements.summaryTrainName.textContent = state.selectedTrain.name;
        elements.summaryRoute.textContent = `${state.journey.fromStation} ➔ ${state.journey.toStation}`;
        elements.summaryDate.textContent = state.journey.journeyDate;
        elements.summaryPassengersCount.textContent = `${passengerCount} ${passengerCount > 1 ? 'Passengers' : 'Passenger'}`;
        elements.summaryClass.textContent = `${state.selectedClass.name} (${state.selectedClass.code})`;
        elements.summaryBaseFare.textContent = `₹${baseFare.toLocaleString('en-IN')}`;
        elements.summaryTax.textContent = `₹${(convenienceFee + gst).toLocaleString('en-IN')}`;
        elements.summaryTotalAmount.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
        elements.btnProcessPayment.textContent = `Pay ₹${grandTotal.toLocaleString('en-IN')} & Confirm Ticket`;

        // Reset live card preview
        elements.previewCardHolder.textContent = state.currentUser ? state.currentUser.toUpperCase() : 'YOUR NAME';
        elements.cardholderNameInput.value = state.currentUser || '';
    }

    // Payment method switcher
    elements.paymentMethods.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.paymentMethods.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const method = btn.dataset.method;
            state.payment.method = method;

            elements.cardPaymentFields.style.display = method === 'card' ? 'block' : 'none';
            elements.upiPaymentFields.style.display = method === 'upi' ? 'block' : 'none';
            elements.netBankingFields.style.display = method === 'netbanking' ? 'block' : 'none';
        });
    });

    // Attach strict guards to Card inputs
    Validator.attachAlphabetGuard(elements.cardholderNameInput, 'Cardholder Name');
    Validator.attachNumberGuard(elements.cardNumberInput, 'Card Number', 16);
    Validator.attachNumberGuard(elements.cardCvvInput, 'CVV', 3);

    // Live update virtual card preview
    elements.cardholderNameInput.addEventListener('input', () => {
        const val = elements.cardholderNameInput.value.trim();
        elements.previewCardHolder.textContent = val ? val.toUpperCase() : 'CARDHOLDER NAME';
    });

    elements.cardNumberInput.addEventListener('input', () => {
        let val = elements.cardNumberInput.value.replace(/\s+/g, '');
        let formatted = '';
        for (let i = 0; i < val.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        elements.previewCardNumber.textContent = formatted || '•••• •••• •••• ••••';
    });

    elements.cardExpiryMonth.addEventListener('change', updateCardExpiry);
    elements.cardExpiryYear.addEventListener('change', updateCardExpiry);

    function updateCardExpiry() {
        elements.previewCardExpiry.textContent = `${elements.cardExpiryMonth.value}/${elements.cardExpiryYear.value.slice(-2)}`;
    }

    if (elements.demoCardBtn) {
        elements.demoCardBtn.addEventListener('click', () => {
            elements.cardholderNameInput.value = state.currentUser || 'MANIKANDAN';
            elements.cardNumberInput.value = '4532890123456789';
            elements.cardCvvInput.value = '823';
            elements.cardExpiryMonth.value = '12';
            elements.cardExpiryYear.value = '2028';
            
            elements.previewCardHolder.textContent = (state.currentUser || 'MANIKANDAN').toUpperCase();
            elements.previewCardNumber.textContent = '4532 8901 2345 6789';
            elements.previewCardExpiry.textContent = '12/28';

            Validator.clearError(elements.cardholderNameInput);
            Validator.clearError(elements.cardNumberInput);
            Validator.clearError(elements.cardCvvInput);
            showToast('Demo Card details populated!', 'info');
        });
    }

    elements.btnPaymentBack.addEventListener('click', () => navigateToStep(3));

    // Process Payment & Generate Ticket
    elements.btnProcessPayment.addEventListener('click', (e) => {
        e.preventDefault();

        if (state.payment.method === 'card') {
            const isNameValid = Validator.validateAlphabetOnly(elements.cardholderNameInput, 'Cardholder Name');
            const isCardNumValid = Validator.validateNumberOnly(elements.cardNumberInput, 'Card Number', 16, 16);
            const isCvvValid = Validator.validateNumberOnly(elements.cardCvvInput, 'CVV', 3, 3);

            if (!isNameValid || !isCardNumValid || !isCvvValid) {
                showToast('Please correct card payment errors before proceeding.', 'error');
                return;
            }
        } else if (state.payment.method === 'upi') {
            const upiVal = elements.upiIdInput.value.trim();
            if (!Validator.regex.upi.test(upiVal)) {
                Validator.showError(elements.upiIdInput, 'Please enter a valid UPI ID (e.g., user@okhdfcbank).');
                return;
            } else {
                Validator.clearError(elements.upiIdInput);
            }
        }

        // Show processing state
        elements.btnProcessPayment.disabled = true;
        elements.btnProcessPayment.innerHTML = `
            <span style="display:inline-block; animation:spin 1s linear infinite; margin-right:8px;">⏳</span> 
            Processing Secure Payment...
        `;

        setTimeout(() => {
            elements.btnProcessPayment.disabled = false;
            generateConfirmedBooking();
            showToast('Payment successful! Your railway ticket has been confirmed.', 'success');
            navigateToStep(5);
        }, 1600);
    });

    // =========================================================================
    // STEP 5: Ticket Confirmation & Download Functionality
    // =========================================================================
    function generatePNR() {
        const part1 = Math.floor(100 + Math.random() * 900);
        const part2 = Math.floor(100 + Math.random() * 900);
        const part3 = Math.floor(1000 + Math.random() * 9000);
        return `${part1}-${part2}-${part3}`;
    }

    function generateCoachAndBerth(classCode, index) {
        let coachPrefix = 'B';
        if (classCode === '1A') coachPrefix = 'H';
        if (classCode === '2A') coachPrefix = 'A';
        if (classCode === '3A') coachPrefix = 'B';
        if (classCode === 'CC') coachPrefix = 'C';
        if (classCode === 'EC') coachPrefix = 'E';
        if (classCode === 'SL') coachPrefix = 'S';

        const coachNum = (index % 3) + 1;
        const seatNum = Math.floor(10 + Math.random() * 60);
        return `${coachPrefix}${coachNum} / Seat ${seatNum}`;
    }

    function generateConfirmedBooking() {
        const pnr = generatePNR();
        const bookingTimeStr = new Date().toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Store result
        state.bookingResult = {
            pnr: pnr,
            bookedAt: bookingTimeStr,
            train: state.selectedTrain,
            class: state.selectedClass,
            passengers: state.passengers.map((p, idx) => ({
                ...p,
                coachSeat: generateCoachAndBerth(state.selectedClass.code, idx),
                status: 'CNF (Confirmed)'
            })),
            amount: state.payment.totalAmount
        };

        // Populate Ticket DOM
        elements.ticketPnr.textContent = pnr;
        elements.ticketTrainName.textContent = state.selectedTrain.name;
        elements.ticketTrainNumber.textContent = `#${state.selectedTrain.number}`;
        elements.ticketFromStation.textContent = `${getStationName(state.journey.fromStation)} (${state.journey.fromStation})`;
        elements.ticketToStation.textContent = `${getStationName(state.journey.toStation)} (${state.journey.toStation})`;
        elements.ticketDepartureTime.textContent = state.selectedTrain.departure;
        elements.ticketArrivalTime.textContent = state.selectedTrain.arrival;
        elements.ticketJourneyDate.textContent = `📅 ${state.journey.journeyDate}`;
        elements.ticketClassQuota.textContent = `${state.selectedClass.name} [${state.selectedClass.code}] • ${state.journey.travelQuota}`;
        elements.ticketTotalFare.textContent = `₹${state.payment.totalAmount.toLocaleString('en-IN')}`;
        elements.ticketBarcodeText.textContent = `PNR:${pnr} | TKT-REF:${Date.now()} | BULLET-RAIL-OK`;

        // Render Passengers in Ticket
        elements.ticketPassengersTableBody.innerHTML = '';
        state.bookingResult.passengers.forEach((p, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${idx + 1}</strong></td>
                <td><strong>${p.name.toUpperCase()}</strong></td>
                <td>${p.age} Yrs / ${p.gender}</td>
                <td>${p.coachSeat}</td>
                <td><span class="berth-badge">🟢 ${p.status}</span></td>
            `;
            elements.ticketPassengersTableBody.appendChild(tr);
        });
    }

    // Print Ticket
    elements.btnPrintTicket.addEventListener('click', () => {
        window.print();
    });

    // Download Ticket as PNG / Image & PDF via Canvas
    elements.btnDownloadTicket.addEventListener('click', () => {
        showToast('Preparing your official high-speed rail ticket...', 'info');

        // Check if html2canvas is available or use high-resolution canvas snapshot
        downloadTicketAsImage();
    });

    function downloadTicketAsImage() {
        const ticketElement = elements.confirmedTicketCard;
        
        // Create an SVG-based clean canvas download
        const pnr = elements.ticketPnr.textContent;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 900;
        canvas.height = 680;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, '#1e3a8a');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, 100);

        // Header Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('🚄 RAILEXPRESS - BULLET TRAIN E-TICKET', 36, 45);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#bae6fd';
        ctx.fillText('MINISTRY OF HIGH-SPEED RAILWAYS • PASSENGER RESERVATION TICKET', 36, 75);

        // PNR Box
        ctx.textAlign = 'right';
        ctx.fillStyle = '#bae6fd';
        ctx.font = '12px sans-serif';
        ctx.fillText('PNR NUMBER', 860, 42);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(pnr, 860, 75);
        ctx.textAlign = 'left';

        // Train & Journey Details
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${state.selectedTrain.name} (#${state.selectedTrain.number})`, 36, 145);

        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(`Date of Journey: ${state.journey.journeyDate}  |  Class: ${state.selectedClass.name} (${state.selectedClass.code})  |  Quota: ${state.journey.travelQuota}`, 36, 175);

        // Route Banner Box
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.fillRect(36, 195, 828, 80);
        ctx.strokeRect(36, 195, 828, 80);

        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`FROM: ${getStationName(state.journey.fromStation)} (${state.journey.fromStation})`, 56, 230);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`Departure: ${state.selectedTrain.departure}`, 56, 255);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`TO: ${getStationName(state.journey.toStation)} (${state.journey.toStation})`, 844, 230);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`Arrival: ${state.selectedTrain.arrival}`, 844, 255);
        ctx.textAlign = 'left';

        // Passenger Table Header
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(36, 300, 828, 36);
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('NO', 50, 323);
        ctx.fillText('PASSENGER NAME', 110, 323);
        ctx.fillText('AGE / GENDER', 360, 323);
        ctx.fillText('COACH / SEAT', 540, 323);
        ctx.fillText('STATUS', 720, 323);

        // Passenger Rows
        let currentY = 360;
        state.bookingResult.passengers.forEach((p, idx) => {
            ctx.fillStyle = '#0f172a';
            ctx.font = '14px sans-serif';
            ctx.fillText(`${idx + 1}`, 50, currentY);
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(p.name.toUpperCase(), 110, currentY);
            ctx.font = '14px sans-serif';
            ctx.fillText(`${p.age} Yrs / ${p.gender}`, 360, currentY);
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#1e40af';
            ctx.fillText(p.coachSeat, 540, currentY);
            ctx.fillStyle = '#15803d';
            ctx.fillText('CONFIRMED (CNF)', 720, currentY);

            ctx.strokeStyle = '#f1f5f9';
            ctx.beginPath();
            ctx.moveTo(36, currentY + 12);
            ctx.lineTo(864, currentY + 12);
            ctx.stroke();

            currentY += 40;
        });

        // Footer Bar
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(36, 560, 828, 80);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(36, 560, 828, 80);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`TOTAL FARE PAID: ₹${state.payment.totalAmount.toLocaleString('en-IN')}`, 56, 595);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`Booked on: ${state.bookingResult.bookedAt} | Payment: Verified Online`, 56, 620);

        ctx.textAlign = 'right';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.fillText('✔ OFFICIAL VALID TICKET', 844, 595);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`BARCODE: ||||||| | ||||| ${pnr} ||||||||`, 844, 620);

        // Convert canvas to downloadable image
        const dataUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `RailExpress_Ticket_${pnr}.png`;
        downloadLink.href = dataUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        showToast(`Ticket downloaded successfully (PNR: ${pnr})!`, 'success');
    }

    // Book another ticket
    elements.btnBookAnother.addEventListener('click', () => {
        state.selectedTrain = null;
        state.selectedClass = null;
        state.bookingResult = null;
        navigateToStep(2);
    });
});
