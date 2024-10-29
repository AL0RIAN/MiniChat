let selectedUserId = null;
let socket = null;
let messagePollingInterval = null;

async function logout() {
    try {
        const response = await fetch("/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "/auth";
        } else {
            console.log("Logout error");
        }

    } catch (error) {
        console.log("Request failed", error);
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function selectUser(userId, userName, event) {
    selectedUserId = userId;
    document.getElementById("chatHeader").innerHTML = `<span>${userName}</span><button class="logout-button" id="logoutButton">Logout</button>`;
    document.getElementById("messageInput").disabled = false;
    document.getElementById("sendButton").disabled = false;

    document.querySelectorAll(".user-item").forEach(item => item.classList.remove("active"));
    event.target.classList.add("active");

    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = "";
    messagesContainer.style.display = "block";
    
    document.getElementById("logoutButton").onclick = logout;

    await loadMessages(userId);
    connectWebSocket();
    startMessagePolling(userId);
    scrollToBottom();
}

async function loadMessages(userId) {
    try {
        const response = await fetch(`/chat/messages/${userId}`);
        const messages = await response.json();

        const messagesContainer = document.getElementById("messages");
        messagesContainer.innerHTML = messages.map(message =>
            createMessageElement(message.content, message.sender_id, message.recipient_id, message.created_at)
        ).join("");
    } catch (error) {
        console.log("Message loading error");
    }
}


function connectWebSocket() {
    if (socket) {
        socket.close()
    };

    socket = new WebSocket(`ws://${window.location.host}/chat/ws/${selectedUserId}`);
    // socket = new WebSocket(`wss://${window.location.host}/chat/ws/${selectedUserId}`);

    socket.onopen = () => console.log("WebSocket connection established");

    socket.onmessage = (event) => {
        const incomingMessage = JSON.parse(event.data);
        if (incomingMessage.recipient_id == selectedUserId) {
            addMessage(incomingMessage.content, incomingMessage.sender_id, incomingMessage.recipient_id, incomingMessage.created_at);
        }
        if (incomingMessage.recipient_id != selectedUserId) {
            addMessage(incomingMessage.content, incomingMessage.sender_id, selectedUserId, incomingMessage.created_at);
        }
    };

    socket.onclose = () => console.log("WebSocket connection closed");
}


async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    const date = new Date();

    if (message && selectedUserId) {
        const payload = { "recipient_id": selectedUserId, "content": message };

        try {
            await fetch("/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            socket.send(JSON.stringify(payload));
            messageInput.value = "";
        } catch (error) {
            console.error("Error sending message", error);
        }
    }
}


function addMessage(text, sender_id, recipient_id, created_at) {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.insertAdjacentHTML('beforeend', createMessageElement(text, sender_id, recipient_id, created_at));
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createMessageElement(text, sender_id, recipient_id, created_at) {
    const userID = parseInt(selectedUserId, 10);
    
    const messageClass = sender_id === userID ? 'other-message' : 'my-message';

    let date = new Date()

    if (created_at != null) {
        const date = new Date(created_at);
    }


    return `
        <div class="message ${messageClass}">
            <span>${text}</span><span class="message-date">${date.getHours()}:${date.getMinutes()}</span>
        </div>
        `;
}

function startMessagePolling(userId) {
    clearInterval(messagePollingInterval);
}

function addUserClickListeners() {
    document.querySelectorAll(".user-item").forEach(item => {
        item.onclick = event => selectUser(item.getAttribute("data-user-id"), item.textContent, event);
    })
}


addUserClickListeners();

document.getElementById("sendButton").onclick = sendMessage;


document.getElementById("messageInput").addEventListener('keydown', async function push_enter(event) {
    if (event.key == "Enter") {
        await sendMessage();
    }
})

async function fetchUsers() {
    try {
        const response = await fetch("/auth/users");
        const users = await response.json();
        const userList = document.getElementById("userList");

        userList.innerHTML = '';

        const contact_header = document.createElement("div");
        contact_header.innerHTML +=
        `
            <div class="contact-header">
                <span>Your contacts</span>
            </div>
        `
        userList.appendChild(contact_header);

        const favoriteElement = document.createElement("div");
        favoriteElement.classList.add("user-item");
        favoriteElement.setAttribute("data-user-id", currentUserId);
        favoriteElement.innerHTML += `
            <span>Favorites</span> 
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="1280.000000pt" height="1217.000000pt" viewBox="0 0 1280.000000 1217.000000"
                preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,1217.000000) scale(0.100000,-0.100000)"
                stroke="none">
                <path d="M6312 11993 c-44 -93 -217 -442 -383 -778 -165 -335 -569 -1152 -896
                -1815 -327 -663 -598 -1208 -601 -1211 -4 -4 -986 -152 -2182 -328 -2420 -358
                -2240 -331 -2240 -340 0 -7 2820 -2761 3077 -3006 l94 -90 -15 -85 c-8 -47
                -58 -341 -111 -655 -105 -618 -171 -1011 -320 -1890 -53 -314 -141 -830 -194
                -1148 -78 -460 -102 -581 -117 -598 -19 -21 -19 -22 4 -15 16 6 22 3 22 -8 0
                -9 2 -16 5 -16 2 0 397 206 877 459 1758 923 2291 1202 2648 1386 201 103 379
                195 395 204 l30 17 1140 -599 c627 -330 1514 -796 1970 -1036 457 -240 831
                -434 833 -430 2 4 -18 128 -43 276 -77 450 -104 606 -135 786 -16 94 -45 267
                -65 382 -20 116 -49 289 -66 385 -16 96 -48 279 -69 405 -21 127 -55 325 -75
                440 -35 206 -63 371 -165 970 -28 165 -69 401 -90 525 l-38 225 66 66 c37 36
                754 735 1595 1553 1318 1284 1525 1489 1513 1501 -10 10 -487 85 -1533 240
                -835 125 -1817 271 -2183 325 -421 63 -668 95 -676 90 -7 -7 -44 58 -122 218
                -61 125 -260 529 -443 897 -182 369 -362 733 -399 810 -37 77 -207 421 -377
                765 -170 344 -383 775 -473 958 -90 182 -166 332 -170 332 -4 0 -43 -75 -88
                -167z"/>
                </g>
            </svg>
            `

        userList.appendChild(favoriteElement);

        users.forEach(user => {
            if (user.id !== currentUserId) {
                const userElement = document.createElement("div");
                userElement.classList.add("user-item");
                userElement.setAttribute("data-user-id", user.id);
                userElement.innerHTML += `
                    <span>${user.name}</span>
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="992.000000pt" height="1280.000000pt" viewBox="0 0 992.000000 1280.000000"
                        preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
                            stroke="none">
                            <path d="M4710 12789 c-617 -58 -1183 -319 -1624 -749 -241 -235 -406 -460
                            -546 -745 -207 -422 -290 -805 -277 -1280 8 -291 46 -510 132 -770 291 -874
                            1011 -1543 1902 -1769 736 -187 1528 -51 2156 368 167 112 267 194 422 350
                            511 513 786 1179 785 1901 -1 439 -86 805 -280 1201 -350 712 -1015 1245
                            -1785 1428 -282 68 -607 92 -885 65z"/>
                            <path d="M4665 7139 c-343 -27 -672 -94 -1000 -204 -1048 -350 -1992 -1142
                            -2653 -2227 -597 -980 -936 -2114 -1002 -3353 -16 -298 -13 -422 9 -472 157
                            -344 1245 -646 2856 -792 717 -65 1214 -86 2085 -85 665 0 891 5 1405 34 701
                            40 1413 119 1970 220 900 163 1457 385 1566 623 22 50 25 174 9 472 -75 1399
                            -505 2682 -1246 3722 -947 1327 -2308 2083 -3728 2072 -94 -1 -216 -5 -271
                            -10z"/>
                        </g>
                    </svg>
                `
                userList.appendChild(userElement);
            }
        });
        addUserClickListeners();
    } catch (error) {
        console.error('Error loading user list:', error);
    }
}

document.addEventListener("DOMContentLoaded", fetchUsers);
setInterval(fetchUsers, 10000);
