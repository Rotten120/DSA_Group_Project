function sendMail(event) {
    event.preventDefault();
    
    // Get form values
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    // EmailJS template parameters
    const templateParams = {
        name: name,
        email: email,
        message: message,
        subject: 'New Contact Form Submission'
    };
    
    // Show loading state
    const submitBtn = form.querySelector('.send-message-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
    submitBtn.disabled = true;
    
    // Send email using EmailJS
    emailjs.send('service_ab5f6nq', 'template_ia8vz75', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> SENT!';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
            
        }, function(error) {
            console.error('FAILED...', error);
            
            // Show error message
            submitBtn.innerHTML = '<i class="fas fa-times"></i> FAILED';
            submitBtn.style.backgroundColor = '#f44336';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
        });
}

// Attach the sendMail function to the form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', sendMail);
    }
});