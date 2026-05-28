
const chatHeaderLeft = document.querySelector(".chatHeaderLeft");
const closeBtn = document.querySelector(".sidebar-close");
const rightSidebar = document.querySelector(".profileInfo");

chatHeaderLeft.addEventListener("click", () => {
    rightSidebar.classList.add("active");
});

closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    rightSidebar.classList.remove("active");
});

class SidebarComponent {
    constructor() {
        this.chatListContainer = document.querySelector('.chat-row-list')
    }
    chatListRender(chatData, chatId, onChatSelect) {

        chatData.sort((chatA, chatB) => {
            const lastMsgA = chatA.messages[chatA.messages.length - 1];
            const lastMsgB = chatB.messages[chatB.messages.length - 1];

            const timeA = lastMsgA ? lastMsgA.timestamp : 0;
            const timeB = lastMsgB ? lastMsgB.timestamp : 0;

            return timeB - timeA;
        })

        this.chatListContainer.innerHTML = ""
        const fragment = document.createDocumentFragment();

        chatData.forEach(item => {
            const chatItem = document.createElement("div")
            chatItem.className = `chat-item ${item.id === chatId ? "active" : ""}`

            const lastMsg = item.messages[item.messages.length - 1];
            const previewText = lastMsg ? lastMsg.text : "No messages";
            const previewTime = lastMsg ? lastMsg.time : "";
            console.log(lastMsg.timestamp)

            chatItem.innerHTML = `
            <div class="avatar-frame">
                        <img src="${item.avatar}"
                            alt="${item.name}-img" class="avatar-img">
                    </div>

                    <div class="chat-body">
                        <div class="chat-header-row">
                            <span class="chat-name">${item.name}</span>
                            <span class="chat-meta">${previewTime}</span>
                        </div>

                        <div class="chat-footer-row">
                            <div class="msg-preview">
                                <span data-testid="status-dblcheck" aria-hidden="true" data-icon="status-dblcheck"
                                    class="status-check status-seen"><svg viewBox="0 0 18 18" height="18" width="18"
                                        preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px"
                                        enable-background="new 0 0 18 18">
                                        <title>status-dblcheck</title>
                                        <path
                                            d="M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z">
                                        </path>
                                    </svg></span>

                                <span class="msg-text">${previewText}</span>
                            </div>
                        </div>
                    </div>
            `
             chatItem.addEventListener("click", () => {
                onChatSelect(item.id);
            });

            fragment.appendChild(chatItem);
        });

        this.chatListContainer.appendChild(fragment);

    }
}

class ChatWindowComponent {
    constructor() {
        this.messageFeed = document.querySelector(".message-feed")
        this.chatInput = document.querySelector(".chat-input")
        this.headerName = document.querySelector(".chat-window-username")
        this.headerAvatar = document.querySelector(".chat-window-img")
    }
    updateHeader(contact) {
        this.headerName.textContent = contact.name
        this.headerAvatar = contact.avatar
    }

    renderFeed(contact) {
        this.messageFeed.innerHTML = ""
        const fragment = document.createDocumentFragment();

        contact.messages.forEach(item => {
            const msgRow = document.createElement("div")
            msgRow.className = `${item.type === "received" ? "msg-row msg-row--received" : "msg-row msg-row--sent"}`
            msgRow.innerHTML = `
            <div class="msg-bubble">
                        <p class="msg-text">${item.text}</p>
                        <div class="msg-meta">
                            <span class="msg-time">${item.time}</span>
                            ${item.type === "sent" ? `
                    <svg viewBox="0 0 18 18" height="18" width="18" preserveAspectRatio="xMidYMid meet"
                        class="status-check" version="1.1" x="0px" y="0px" enable-background="new 0 0 18 18">
                        <title>status-dblcheck</title>
                        <path
                            d="M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z">
                        </path>
                    </svg>` : ""}
                        </div>
                    </div>
                    `
            fragment.appendChild(msgRow)

        })
        this.messageFeed.appendChild(fragment);

    }

}


class WhatsAppApplication {
    constructor() {
        this.chatsPool = []
        this.activeChatId = null
        this.chatWindow = new ChatWindowComponent()
        this.sidebar = new SidebarComponent()

    }

    init() {
        this.loadData()
        this.renderAll()
    }

    loadData() {
        const savedData = JSON.parse(localStorage.getItem("chatListData"))

        if (savedData) {
            this.chatsPool = savedData
        } else {
            this.chatsPool = [{
                id: 1, name: "User 1", phone: "+91 9999999999", about: "Hey there! I am using WhatsApp.",
                avatar: "https://t3.ftcdn.net/jpg/13/11/22/86/360_F_1311228699_YoiLc5aJ3RWz3uRfdEtlV0UYSQjqf7RW.jpg",
                messages: [
                    { id: 1, text: "Hii", time: "10:24 pm", timestamp: Date.now() - 50000, type: "received" },
                    { id: 2, text: "Hello", time: "10:26 pm", timestamp: Date.now() - 45000, type: "sent" },
                    { id: 3, text: "Hi", time: "10:28 pm", timestamp: Date.now() - 40040, type: "received" },
                    { id: 4, text: "Hi, Good Morning", time: "10:30 pm", timestamp: Date.now() - 35060, type: "received" },
                    { id: 5, text: "Hii sir, Good Morning", time: "10:32 pm", timestamp: Date.now() - (32000), type: "sent" }
                ]
            },
            {
                id: 2, name: "User 2", phone: "+91 8888888888", about: "Just Living!",
                avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
                messages: [
                    { id: 1, text: "Hii", time: "09:24 pm", timestamp: Date.now() - 50000, type: "received" },
                    { id: 2, text: "Hii", time: "09:26 pm", timestamp: Date.now() - 45000, type: "sent" },
                    { id: 3, text: "Hello", time: "09:28 pm", timestamp: Date.now() - 40040, type: "received" },
                    { id: 4, text: "submit your notes", time: "09:30 pm", timestamp: Date.now() - 35060, type: "received" },
                    { id: 5, text: "Ok", time: "09:32 pm", timestamp: Date.now() - 33070, type: "sent" }
                ]
            }]
        }
    }

    handleChatSelection(chatId) {
        this.activeChatId = chatId;
        this.renderAll();
    }

    renderAll() {
        const activeChat = this.chatsPool.find(c => c.id === this.activeChatId) || this.chatsPool[0];
        this.sidebar.chatListRender(this.chatsPool, activeChat.id, this.handleChatSelection.bind(this))
        this.chatWindow.renderFeed(activeChat)
        this.chatWindow.updateHeader(activeChat);
    }
}

const obj = new WhatsAppApplication()
obj.init()
