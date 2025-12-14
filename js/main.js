const WEB3FORMS_ACCESS_KEY = "WEB3_ACCESS_KEY";
    async function submitForm(e) {
        e.preventDefault();

        const form = e.target;
        // The submit button is the one with type="submit" inside the form
        const submitBtn = form.querySelector('button[type="submit"]');
        const sentMsg = document.getElementById('sent-msg'); // The success message paragraph

        // --- 1. Prepare Loading State ---
        const originalHtml = submitBtn ? submitBtn.innerHTML : '<i class="fas fa-paper-plane me-2"></i>Submit Message';
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
            submitBtn.disabled = true;
        }
        if (sentMsg) sentMsg.classList.add('d-none'); // Hide any previous messages

        const formData = new FormData(form);
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);

        // --- 2. Custom Data Formatting (as requested previously) ---
        const name = document.getElementById('name').value.trim();

        // Custom Subject: Use provided subject or generate a default one
        const customSubject = document.getElementById('subject').value.trim() || 'Website enquiry from ' + name;
        formData.set('subject', customSubject);
        // --- End Custom Data Formatting ---


        try {
            // --- 3. Send Request ---
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            // --- 4. Handle Response ---
            if (response.ok && data.success) {
                // SUCCESS
                if (sentMsg) {
                    // Update the hidden paragraph with a clear message and show it
                    sentMsg.innerHTML = '<i class="fas fa-check-circle me-2"></i>Success! Your message has been sent.';
                    sentMsg.classList.remove('d-none');
                    sentMsg.classList.remove('text-danger');
                    sentMsg.classList.add('text-success');
                } else {
                    alert("Success! Your message has been sent.");
                }
                form.reset();
            } else {
                // API ERROR (e.g., missing fields, bad key)
                console.error("Web3Forms Error:", data);
                const errorMessage = data.message || "There was an issue sending your message.";
                 if (sentMsg) {
                    sentMsg.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Error: ' + errorMessage;
                    sentMsg.classList.remove('d-none');
                    sentMsg.classList.remove('text-success');
                    sentMsg.classList.add('text-danger');
                } else {
                    alert("Error: " + errorMessage);
                }
            }

        } catch (error) {
            // --- 5. NETWORK ERROR ---
            console.error("Network Error:", error);
            if (sentMsg) {
                sentMsg.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Network Error: Could not reach the server. Please try again.';
                sentMsg.classList.remove('d-none');
                sentMsg.classList.remove('text-success');
                sentMsg.classList.add('text-danger');
            } else {
                 alert("Something went wrong. Please check your internet connection and try again.");
            }
        } finally {
            // --- 6. Reset Loading State ---
            if (submitBtn) {
                submitBtn.innerHTML = originalHtml;
                submitBtn.disabled = false;
            }
        }
    }

// Initialize hero carousel with auto-sliding
document.addEventListener('DOMContentLoaded', function() {
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel) {
    const carousel = new bootstrap.Carousel(heroCarousel, {
      interval: 5000,
      ride: 'carousel',
      wrap: true,
      pause: false
    });
    
    // Ensure carousel continues auto-sliding after manual navigation
    heroCarousel.addEventListener('slid.bs.carousel', function() {
      carousel.cycle();
    });
  }
});
