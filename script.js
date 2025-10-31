// Get DOM elements
const sosButton = document.getElementById('sosButton');
const alertsList = document.getElementById('alertsList');
const toast = document.getElementById('toast');

// Function to format time
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Function to create alert card HTML
function createAlertCard(phoneNumber, message, timestamp) {
    const alertCard = document.createElement('div');
    alertCard.className = 'alert-card';
    
    alertCard.innerHTML = `
        <div class="alert-content">
            <svg class="phone-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <div class="alert-details">
                <p class="phone-number">${phoneNumber}</p>
                <div class="message-container">
                    <svg class="alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p class="alert-message">${message}</p>
                </div>
                <p class="alert-timestamp">${timestamp}</p>
            </div>
        </div>
    `;
    
    return alertCard;
}

// Function to show toast notification
function showToast() {
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Define endpoints
const awsEndpoint = "https://your-aws-api.execute-api.us-east-1.amazonaws.com/dev/sos";
const gcpEndpoint = "https://your-gcp-function-url/sos";

// Function to handle SOS button click
async function handleSOSClick() {
    const currentTime = getCurrentTime();
    const phoneNumber = '+917397598892';
    const message = "It's an Emergency, Help me now please.";
    const timestamp = new Date().toISOString();
    
    // Create data payload
    const data = {
        name: "Emergency Contact",
        location: "User Location",
        message: message,
        timestamp: timestamp
    };

    // Choose provider (randomly alternate between AWS and GCP)
    const selectedProvider = Math.random() < 0.5 ? "AWS" : "GCP";
    const endpoint = selectedProvider === "AWS" ? awsEndpoint : gcpEndpoint;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            // Create new alert card
            const newAlert = createAlertCard(phoneNumber, message, `at ${currentTime}`);
            alertsList.insertBefore(newAlert, alertsList.firstChild);
            
            // Show toast notification
            showToast();
        }
    } catch (error) {
        console.error("Failed to send SOS alert:", error);
    }
    
    // Add pulse effect to button
    sosButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        sosButton.style.transform = '';
    }, 100);
}

// Add event listener to SOS button
sosButton.addEventListener('click', handleSOSClick);

// Optional: Add keyboard support (Space or Enter to trigger)
sosButton.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSOSClick();
    }
});
