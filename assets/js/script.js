let currentUser = null;
        let users = JSON.parse(localStorage.getItem('newsletterUsers') || '[]');
        let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        let donations = JSON.parse(localStorage.getItem('newsletterDonations') || '[]');

        // Check if user is logged in on page load
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUIForLoggedInUser();
        }

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }

        // Registration
        function register(event) {
            event.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            // Check if user already exists
            if (users.find(user => user.email === email)) {
                alert('User with this email already exists!');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password, // In real app, this should be hashed
                joinDate: new Date().toISOString(),
                preferences: []
            };

            users.push(newUser);
            localStorage.setItem('newsletterUsers', JSON.stringify(users));
            
            // Auto-login after registration
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            closeModal('registerModal');
            updateUIForLoggedInUser();
            alert('Registration successful! Welcome to NewsWave!');
        }

        // Login
        function login(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                closeModal('loginModal');
                updateUIForLoggedInUser();
                alert('Login successful! Welcome back!');
            } else {
                alert('Invalid email or password!');
            }
        }

        // Logout
        function logout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            document.body.className = 'logged-out';
            alert('You have been logged out successfully!');
        }

        // Update UI for logged in user
        function updateUIForLoggedInUser() {
            if (currentUser) {
                document.body.className = 'logged-in';
                
                // Update dashboard info
                document.getElementById('userName').textContent = currentUser.name;
                document.getElementById('userEmail').textContent = currentUser.email;
                document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
                document.getElementById('memberSince').textContent = new Date(currentUser.joinDate).toLocaleDateString();
                
                // Update preferences
                updateUserPreferences();
                updateDonationHistory();
            }
        }

        // Newsletter subscription
        function subscribe(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const checkboxes = document.querySelectorAll('input[name="categories"]:checked');
            const categories = Array.from(checkboxes).map(cb => cb.value);

            if (categories.length === 0) {
                alert('Please select at least one newsletter category!');
                return;
            }

            const subscription = {
                id: Date.now().toString(),
                email: email,
                name: name,
                categories: categories,
                subscribeDate: new Date().toISOString()
            };

            subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));

            // If user is logged in, update their preferences
            if (currentUser) {
                currentUser.preferences = categories;
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem('newsletterUsers', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }

            alert('Successfully subscribed to the newsletter! Thank you for joining NewsWave!');
            document.getElementById('subscribeForm').reset();
            
            if (currentUser) {
                updateUserPreferences();
            }
        }

        // Donation functions
        function donate(amount) {
            processDonation(amount);
        }

        function donateCustom() {
            const amount = parseFloat(document.getElementById('customAmount').value);
            if (amount && amount > 0) {
                processDonation(amount);
                document.getElementById('customAmount').value = '';
            } else {
                alert('Please enter a valid donation amount!');
            }
        }

        function processDonation(amount) {
            // In a real application, this would integrate with PayPal or Stripe
            const donation = {
                id: Date.now().toString(),
                amount: amount,
                date: new Date().toISOString(),
                userEmail: currentUser ? currentUser.email : 'anonymous'
            };

            donations.push(donation);
            localStorage.setItem('newsletterDonations', JSON.stringify(donations));

            // Simulate PayPal redirect
            alert(`Thank you for your generous donation of $${amount}! You would normally be redirected to PayPal to complete the payment.`);
            
            if (currentUser) {
                updateDonationHistory();
            }
        }

        // Update user preferences display
        function updateUserPreferences() {
            if (!currentUser) return;
            
            const preferencesDiv = document.getElementById('userPreferences');
            const userSubs = subscriptions.filter(sub => sub.email === currentUser.email);
            
            if (userSubs.length === 0) {
                preferencesDiv.innerHTML = '<p>No newsletter subscriptions yet. <a href="#newsletter" style="color: #667eea;">Subscribe now!</a></p>';
            } else {
                const latestSub = userSubs[userSubs.length - 1];
                const categoriesHTML = latestSub.categories.map(cat => 
                    `<span style="background: #667eea; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; margin: 0.2rem; display: inline-block; font-size: 0.9rem;">${cat.replace('-', ' ').toUpperCase()}</span>`
                ).join('');
                preferencesDiv.innerHTML = `<p>Subscribed Categories:</p><div style="margin-top: 1rem;">${categoriesHTML}</div>`;
            }
        }

        // Update donation history
        function updateDonationHistory() {
            if (!currentUser) return;
            
            const historyDiv = document.getElementById('donationHistory');
            const userDonations = donations.filter(donation => donation.userEmail === currentUser.email);
            
            if (userDonations.length === 0) {
                historyDiv.innerHTML = '<p>No donations yet. Thank you for considering supporting us!</p>';
            } else {
                const total = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
                const donationsHTML = userDonations.map(donation => 
                    `<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                        <span>${donation.amount}</span>
                        <span style="color: #666; font-size: 0.9rem;">${new Date(donation.date).toLocaleDateString()}</span>
                    </div>`
                ).join('');
                historyDiv.innerHTML = `
                    <p style="font-weight: bold; color: #667eea; margin-bottom: 1rem;">Total Donated: ${total}</p>
                    <div>${donationsHTML}</div>
                `;
            }
        }

        // Edit preferences
        function editPreferences() {
            alert('This feature would allow you to modify your newsletter preferences. In a full implementation, this would open a modal with checkboxes for different categories.');
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add some interactive animations
        document.addEventListener('DOMContentLoaded', function() {
            // Animate cards on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all cards
            document.querySelectorAll('.newsletter-card, .donation-card, .dashboard-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        });

        // Add floating animation to hero buttons
        setInterval(() => {
            const buttons = document.querySelectorAll('.hero-buttons .btn');
            buttons.forEach((btn, index) => {
                setTimeout(() => {
                    btn.style.transform = 'translateY(-5px)';
                    setTimeout(() => {
                        btn.style.transform = 'translateY(0)';
                    }, 200);
                }, index * 100);
            });
        }, 3000);

        // Add particle effect to hero section (simple version)
        function createParticle() {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'rgba(255, 255, 255, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.animation = 'floatUp 8s linear infinite';
            
            document.querySelector('.hero').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 8000);
        }

        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                to {
                    transform: translateY(-100vh);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Create particles periodically
        setInterval(createParticle, 500);

        // Add success messages with better styling
        function showSuccessMessage(message) {
            const successDiv = document.createElement('div');
            successDiv.style.position = 'fixed';
            successDiv.style.top = '100px';
            successDiv.style.right = '20px';
            successDiv.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            successDiv.style.color = 'white';
            successDiv.style.padding = '1rem 2rem';
            successDiv.style.borderRadius = '10px';
            successDiv.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            successDiv.style.zIndex = '9999';
            successDiv.style.animation = 'slideInRight 0.5s ease';
            successDiv.textContent = message;
            
            document.body.appendChild(successDiv);
            
            setTimeout(() => {
                successDiv.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => {
                    successDiv.remove();
                }, 500);
            }, 3000);
        }

        // Add CSS for success message animations
        const successStyle = document.createElement('style');
        successStyle.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(successStyle);

        // Enhanced donation function with PayPal simulation
        function processDonation(amount) {
            const donation = {
                id: Date.now().toString(),
                amount: amount,
                date: new Date().toISOString(),
                userEmail: currentUser ? currentUser.email : 'anonymous'
            };

            donations.push(donation);
            localStorage.setItem('newsletterDonations', JSON.stringify(donations));

            // Create a more realistic PayPal simulation
            const paypalWindow = document.createElement('div');
            paypalWindow.style.position = 'fixed';
            paypalWindow.style.top = '50%';
            paypalWindow.style.left = '50%';
            paypalWindow.style.transform = 'translate(-50%, -50%)';
            paypalWindow.style.background = 'white';
            paypalWindow.style.padding = '2rem';
            paypalWindow.style.borderRadius = '10px';
            paypalWindow.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            paypalWindow.style.zIndex = '9999';
            paypalWindow.style.textAlign = 'center';
            paypalWindow.innerHTML = `
                <div style="color: #0070ba; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">PayPal</div>
                <p>Redirecting to PayPal...</p>
                <p style="color: #666; margin: 1rem 0;">Amount: ${amount}</p>
                <div style="margin: 2rem 0;">
                    <div style="width: 30px; height: 30px; border: 3px solid #0070ba; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
                <button onclick="this.parentElement.remove(); showSuccessMessage('Donation processed successfully! Thank you for your support.')" 
                        style="background: #0070ba; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                    Complete Payment
                </button>
            `;
            
            document.body.appendChild(paypalWindow);
            
            if (currentUser) {
                setTimeout(() => {
                    updateDonationHistory();
                }, 1000);
            }
        }

        // Add spin animation for loading
        const spinStyle = document.createElement('style');
        spinStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyle);