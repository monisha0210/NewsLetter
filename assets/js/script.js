// User management
let currentUser = null;
let users = {}; // In-memory user storage
let selectedDonationAmount = 15;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    setupEventListeners();
    initializePayPal();
    });

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
            
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
            
    // Custom amount input
    document.getElementById('customAmount').addEventListener('input', function() {
        const amount = parseInt(this.value) || 0;
        if (amount > 0) {
            selectAmount(amount);
        }
    });
}

        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(sectionId).classList.add('active');
            
            // Update URL hash
            window.location.hash = sectionId;
        }

        function handleLogin(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation (in real app, this would be server-side)
            if (users[email] && users[email].password === password) {
                currentUser = users[email];
                updateAuthUI();
                showMessage('loginMessage', 'Login successful! Welcome back.', 'success');
                setTimeout(() => showSection('dashboard'), 1500);
            } else {
                showMessage('loginError', 'Invalid email or password.', 'error');
            }
        }

        function handleRegister(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (password !== confirmPassword) {
                showMessage('registerError', 'Passwords do not match.', 'error');
                return;
            }
            
            if (users[email]) {
                showMessage('registerError', 'Email already registered.', 'error');
                return;
            }
            
            // Create user
            users[email] = {
                name: name,
                email: email,
                password: password,
                joinDate: new Date().toISOString()
            };
            
            currentUser = users[email];
            updateAuthUI();
            showMessage('registerMessage', 'Registration successful! Welcome to NewsletterPro.', 'success');
            setTimeout(() => showSection('dashboard'), 1500);
        }

        function updateAuthUI() {
            const authButtons = document.getElementById('authButtons');
            const userMenu = document.getElementById('userMenu');
            const welcomeUser = document.getElementById('welcomeUser');
            
            if (currentUser) {
                authButtons.classList.add('hidden');
                userMenu.classList.remove('hidden');
                welcomeUser.textContent = `Welcome, ${currentUser.name.split(' ')[0]}!`;
            } else {
                authButtons.classList.remove('hidden');
                userMenu.classList.add('hidden');
            }
        }

        function logout() {
            currentUser = null;
            updateAuthUI();
            showSection('home');
        }

        function checkUserLogin() {
            // In a real app, you'd check for stored authentication tokens
            updateAuthUI();
        }

        function showMessage(elementId, message, type) {
            const element = document.getElementById(elementId);
            element.textContent = message;
            element.style.display = 'block';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }

        function selectAmount(amount) {
            // Remove previous selections
            document.querySelectorAll('.donation-amount').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Select new amount
            event.target.closest('.donation-amount')?.classList.add('selected');
            selectedDonationAmount = amount;
            document.getElementById('selectedAmount').textContent = amount;
            document.getElementById('customAmount').value = amount;
            
            // Re-render PayPal buttons with new amount
            document.getElementById('paypal-button-container').innerHTML = '';
            initializePayPal();
        }

        function initializePayPal() {
            // PayPal SDK integration
            // Note: In production, you'd load the PayPal SDK and use your actual client ID
            
            // Simulated PayPal button (replace with actual PayPal integration)
            const paypalContainer = document.getElementById('paypal-button-container');
            paypalContainer.innerHTML = `
                <button class="btn btn-primary" onclick="simulatePayPalDonation()" style="background: #0070ba; padding: 1rem 2rem; font-size: 1.1rem;">
                    💳 Donate $${selectedDonationAmount} via PayPal
                </button>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                    Secure payment powered by PayPal
                </p>
            `;
        }

        function simulatePayPalDonation() {
            // In production, this would integrate with actual PayPal
            alert(`Thank you for your $${selectedDonationAmount} donation! 🎉\n\nIn a real implementation, this would process through PayPal's secure payment system.`);
        }

        // Handle browser back/forward
        window.addEventListener('hashchange', function() {
            const section = window.location.hash.slice(1) || 'home';
            if (document.getElementById(section)) {
                showSection(section);
            }
        });

        // Initialize with hash if present
        if (window.location.hash) {
            const section = window.location.hash.slice(1);
            if (document.getElementById(section)) {
                showSection(section);
            }
        }

    // PayPal SDK (uncomment and add your client ID for production)
    // <script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
    // <script>
    //     paypal.Buttons({
    //         createOrder: function(data, actions) {
    //             return actions.order.create({
    //                 purchase_units: [{
    //                     amount: {
    //                         value: selectedDonationAmount.toString()
    //                     }
    //                 }]
    //             });
    //         },
    //         onApprove: function(data, actions) {
    //             return actions.order.capture().then(function(details) {
    //                 alert('Thank you for your donation, ' + details.payer.name.given_name + '!');
    //             });
    //         }
    //     }).render('#paypal-button-container');
    