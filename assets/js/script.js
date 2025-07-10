// Page Navigation
        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update URL hash
            window.location.hash = pageId;
            
            // Scroll to top
            window.scrollTo(0, 0);
        }

        // Modal Functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // Form Handlers
        document.getElementById('subscribeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const name = formData.get('name');
            const categories = formData.getAll('categories');
            const frequency = formData.get('frequency');
            
            // Simulate API call
            setTimeout(() => {
                document.getElementById('subscribeSuccess').classList.add('show');
                this.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('subscribeSuccess').classList.remove('show');
                }, 5000);
            }, 1000);
        });

        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('contactName');
            const email = formData.get('contactEmail');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simulate API call
            setTimeout(() => {
                document.getElementById('contactSuccess').classList.add('show');
                this.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('contactSuccess').classList.remove('show');
                }, 5000);
            }, 1000);
        });

        document.getElementById('excelRequestForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const templateName = formData.get('templateName');
            const description = formData.get('templateDescription');
            const email = formData.get('requestorEmail');
            const category = formData.get('category');
            
            // Simulate API call
            setTimeout(() => {
                document.getElementById('excelRequestSuccess').classList.add('show');
                this.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('excelRequestSuccess').classList.remove('show');
                }, 5000);
            }, 1000);
        });

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('loginEmail');
            const password = formData.get('loginPassword');
            
            // Simulate login
            setTimeout(() => {
                alert('Login successful! Welcome back.');
                closeModal('loginModal');
                this.reset();
            }, 1000);
        });

        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('signupName');
            const email = formData.get('signupEmail');
            const password = formData.get('signupPassword');
            const confirmPassword = formData.get('confirmPassword');
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Simulate signup
            setTimeout(() => {
                alert('Account created successfully! Please check your email for verification.');
                closeModal('signupModal');
                this.reset();
            }, 1000);
        });

        // Initialize page based on URL hash
        window.addEventListener('load', function() {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                showPage(hash);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('hashchange', function() {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                showPage(hash);
            } else {
                showPage('home');
            }
        });

        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add loading animation to buttons
        document.querySelectorAll('button[type="submit"]').forEach(button => {
            button.addEventListener('click', function() {
                const originalText = this.textContent;
                this.textContent = 'Processing...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            });
        });