document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validate form fields
        if (!email || !username || !password) {
            authMsg.textContent = "Please fill in all fields.";
            return; // Exit if any field is missing
        }

        try {
            // Make API request to register the user
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                // Handle error response from the server
                authMsg.textContent = `Error: ${data.message || "Something went wrong"}`;
            } else {
                // Handle successful response
                authMsg.textContent = `Success: ${data.message || "Registration successful!"}`;
                // Redirect to landing page after successful registration
                // This will automatically redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = "/test/index.html";
                }, 2000); // 2 seconds delay to show success message
            }

        } catch (err) {
            // Handle fetch errors (network issues, server not reachable, etc.)
            authMsg.textContent = `Error: ${err.message || "An error occurred"}`;
        }
    });
});
