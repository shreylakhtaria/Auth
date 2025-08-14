// Auth System Documentation JavaScript
function copyToClipboard(mutationType) {
    const mutations = {
        signup: `mutation Signup {
  signup(signupInput: {
    email: "test@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
      role
      isVerified
    }
  }
}`,
        verifyOtp: `mutation VerifyOtp {
  verifyOtp(verifyOtpInput: {
    email: "test@example.com"
    otp: "123456"
  }) {
    success
    message
  }
}`,
        resendOtp: `mutation ResendOtp {
  resendOtp(resendOtpInput: {
    email: "test@example.com"
  })
}`,
        login: `mutation Login {
  login(loginInput: {
    email: "test@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
      role
      isVerified
    }
  }
}`,
        me: `query Me {
  me {
    id
    email
    role
    isVerified
    createdAt
    updatedAt
  }
}`
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(mutations[mutationType]).then(function() {
            // Change button text temporarily
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '✅ Copied!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#28a745';
            }, 2000);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = mutations[mutationType];
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Mutation copied to clipboard!');
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Ensure the toggleNavMenu function works seamlessly
function toggleNavMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}
