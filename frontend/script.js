function showPopupAlert(message) {
    let alertDiv = document.getElementById('popupAlert');
    if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.id = 'popupAlert';
        alertDiv.className = 'popup-alert';
        document.body.appendChild(alertDiv);
    }
    alertDiv.textContent = message;
    alertDiv.classList.add('show');
    // Remove after 3 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
    }, 3000);
}

async function analyze() {
    const inputText = document.getElementById('inputText').value;
    const resultDiv = document.getElementById('result');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show loading spinner
    loadingSpinner.style.display = 'flex';
    resultDiv.textContent = '';
    resultDiv.className = '';

    try {
        const response = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: inputText }),
        });

        const data = await response.json();
        resultDiv.textContent = `This looks like: ${data.result}`;
        resultDiv.className = data.result;

        // If phishing, show popup and play sound
        if (data.result === 'phishing') {
            showPopupAlert('⚠️ Warning: This message or link is likely PHISHING!');
            const alertSound = document.getElementById('alertSound');
            if (alertSound) {
                alertSound.currentTime = 0;
                const playPromise = alertSound.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.warn('Sound could not be played automatically:', error);
                    });
                }
            }
        }
    } catch (error) {
        resultDiv.textContent = 'Error: Could not connect to backend.';
        resultDiv.className = '';
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
} 

window.addEventListener('DOMContentLoaded', () => {
    // Show disclaimer popup for 5 seconds on page load
    let disclaimerDiv = document.createElement('div');
    disclaimerDiv.textContent = 'Disclaimer: This AI model may occasionally make incorrect predictions. Please use your own judgment and stay cautious.';
    disclaimerDiv.style.position = 'fixed';
    disclaimerDiv.style.top = '50%';
    disclaimerDiv.style.left = '50%';
    disclaimerDiv.style.transform = 'translate(-50%, -50%)';
    disclaimerDiv.style.background = 'rgba(44,44,46,0.95)';
    disclaimerDiv.style.color = '#fff';
    disclaimerDiv.style.padding = '18px 36px';
    disclaimerDiv.style.borderRadius = '16px';
    disclaimerDiv.style.fontSize = '1.08rem';
    disclaimerDiv.style.fontStyle = 'italic';
    disclaimerDiv.style.fontWeight = '500';
    disclaimerDiv.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    disclaimerDiv.style.zIndex = '99999';
    disclaimerDiv.style.textAlign = 'center';
    disclaimerDiv.style.maxWidth = '90vw';
    disclaimerDiv.style.opacity = '0';
    disclaimerDiv.style.transition = 'opacity 0.5s';
    document.body.appendChild(disclaimerDiv);
    setTimeout(() => { disclaimerDiv.style.opacity = '1'; }, 100);
    setTimeout(() => {
        disclaimerDiv.style.opacity = '0';
        setTimeout(() => disclaimerDiv.remove(), 600);
    }, 5100);
}); 