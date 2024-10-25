document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

window.onload = function() {
    const introMessage = `Welcome, seeker of wisdom! I am your digital fortune cookie. Ask me anything, and I will give you short and sweet words of wisdom, just like the fortunes you find in your favorite cookies.`;
    displayMessage(introMessage, 'bot');
};

function openCookie() {
    const cookieImg = document.getElementById('fortune-cookie');
    cookieImg.style.opacity = '0';

    setTimeout(() => {
        cookieImg.src = 'FCOpen.jpg';
        setTimeout(() => {
            cookieImg.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            cookieImg.style.opacity = '0';
            setTimeout(() => {
                cookieImg.src = 'FCClosed.avif.png';
                setTimeout(() => {
                    cookieImg.style.opacity = '1';
                }, 100);
            }, 500);
        }, 5000);
    }, 500);
}

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    displayMessage(userInput, 'user');
    openCookie();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();

        if (data.choices && data.choices[0].message && data.choices[0].message.content) {
            displayMessage(data.choices[0].message.content, 'bot');
        } else {
            displayMessage("The fortune cookie is silent... Please try again.", 'bot');
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        displayMessage("The fortune cookie encountered an error. Please try again.", 'bot');
    }

    document.getElementById('user-input').value = '';
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}