const PRELOADED_REPLIES = [
    "Hey! I'm a bit busy right now, will check this later.",
    "Wow, that sounds interesting",
    "Let's catch up this weekend.",
    "Okay, cool.",
    "Perfect! Thanks for the update.",
    "Hey, what's up?"
];


class Message {
    constructor(text, type) {
        this.id = Date.now() + Math.random();
        this.text = text;
        this.type = type;
        const now = new Date();
        this.time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        this.timestamp = now.getTime();
    }
}


class SidebarComponent {
    constructor() {
        this.chatListContainer = document.querySelector('.chat-row-list')
        this.searchInput = document.querySelector(".search-wrapper .search-input");
        this.currentSearchQuery = "";

        this.openMenuChatId = null;
        this.activeFilter = false; 

        this.favPillBtn = document.querySelector("#favPillBtn");
        this.allPillBtn = document.querySelector("#allPillBtn");

        this.initSearchListener();
        this.initFilterListeners();
    }

    initSearchListener() {
        this.searchInput.addEventListener("input", (e) => {
            this.currentSearchQuery = e.target.value.toLowerCase().trim();
            obj.renderAll();
        });
    }
    
   changeFavourites(filterFavourites) {
        this.activeFilter = filterFavourites; 
        obj.renderAll();
    }

    initFilterListeners() {
        if (this.favPillBtn) {
            this.favPillBtn.addEventListener("click", () => {
                this.changeFavourites(true);
                
                this.favPillBtn.classList.add("active")
                this.allPillBtn.classList.remove("active")
            });
        }
        if (this.allPillBtn) {
            this.allPillBtn.addEventListener("click", () => {
                this.changeFavourites(false);
                this.allPillBtn.classList.add("active")
                this.favPillBtn.classList.remove("active")
            });
        }
    }

    chatListRender(chatData, chatId = null, onChatSelect, onToggleFavourite) {

        this.chatListContainer.innerHTML = ""

        const filteredChats = chatData.filter(chat =>{
            const matchesSearch = chat.name.toLowerCase().includes(this.currentSearchQuery);

            const matchesPill = this.activeFilter ? chat.isFavourite === true : true;
            return matchesSearch && matchesPill;
    });

        filteredChats.sort((chatA, chatB) => {
            const lastMsgA = chatA.messages[chatA.messages.length - 1];
            const lastMsgB = chatB.messages[chatB.messages.length - 1];

            const timeA = lastMsgA ? lastMsgA.timestamp : 0;
            const timeB = lastMsgB ? lastMsgB.timestamp : 0;

            return timeB - timeA;
        })

        const fragment = document.createDocumentFragment();

        filteredChats.forEach(item => {
            const chatItem = document.createElement("div")
            chatItem.className = `chat-item ${item.id === chatId ? "active" : ""}`

            const lastMsg = item.messages[item.messages.length - 1];
            const previewText = lastMsg ? lastMsg.text : "No messages";
            const previewTime = lastMsg ? lastMsg.time : "";

            const favStarIcon = item.isFavourite
                ? `<svg style="fill: #e1b000; width:14px; height:14px; margin-left: 4px;" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
                : '';

            const doubleCheckHtml = (lastMsg && lastMsg.type === "sent") ? `
                <span data-testid="status-dblcheck" aria-hidden="true" data-icon="status-dblcheck" class="status-check status-seen">
                    <svg viewBox="0 0 18 18" height="18" width="18" preserveAspectRatio="xMidYMid meet" version="1.1">
                        <title>status-dblcheck</title>
                        <path d="M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z"></path>
                    </svg>
                </span>`
                : '';

            chatItem.innerHTML = `
                <div class="avatar-frame">
                    <img src="${item.avatar}" alt="${item.name}-img" class="avatar-img">
                </div>

                <div class="chat-body">
                    <div class="chat-header-row">
                        <span class="chat-name">${item.name}</span>
                        <span class="chat-meta">${previewTime}</span>
                    </div>

                    <div class="chat-footer-row">
                        <div class="msg-preview">
                            ${doubleCheckHtml}
                            <span class="msg-text">${previewText}</span>
                        </div>
                        <div class="chat-meta-column">
                            <button class="chat-action-trigger" data-action="menu-toggle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `

            chatItem.addEventListener("click", (e) => {
                const isMenuTrigger = e.target.closest('[data-action="menu-toggle"]');

                if (isMenuTrigger) {
                    e.stopPropagation();

                    obj.contextMenu.showMenu(e, item);
                    return;
                }

                onChatSelect(item.id);
            });

            fragment.appendChild(chatItem);
        });

        this.chatListContainer.appendChild(fragment);
    }
}

class ContextMenuComponent {
    constructor(onToggleFavouriteCallback) {
        this.onToggleFavourite = onToggleFavouriteCallback;
        this.activeChatTarget = null;

        this.menuElement = document.createElement("div");
        this.menuElement.className = "context-menu-panel d-none";
        document.body.appendChild(this.menuElement);

        this.bindEvents();
    }

    showMenu(clickEvent, chatItemModel) {
        this.activeChatTarget = chatItemModel;

        this.menuElement.innerHTML = `
            <ul class="context-menu-panel__list">
                <li class="context-menu-panel__item"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5V8h14v10z"/></svg> Archive chat</li>
                <li class="context-menu-panel__item"><svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 4.36 6 6.92 6 10v5l-2 2v1h16v-1l-2-2z"/></svg> Mute notifications</li>
                <li class="context-menu-panel__item context-menu-panel__item--divider"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5V8h14v10z"/></svg> Mark as unread</li>
                
                <li class="context-menu-panel__item ${chatItemModel.isFavourite ? 'is-active-fav' : ''}" data-action="execute-fav">
                    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ${chatItemModel.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                </li>

                <li class="context-menu-panel__item context-menu-panel__item--divider"><svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg> Add to list</li>
                        <li class="context-menu-panel__item"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Block</li>
                        <li class="context-menu-panel__item"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg> Clear chat</li>
                
                <li class="context-menu-panel__item"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/></svg> Delete chat</li>
            </ul>
        `;

        const rect = clickEvent.currentTarget.getBoundingClientRect();

        this.menuElement.style.top = `${rect.bottom + window.scrollY + 4}px`;
        this.menuElement.style.left = `${rect.left + window.scrollX + 420}px`;

        this.menuElement.classList.remove("d-none");
    }

    hideMenu() {
        this.menuElement.classList.add("d-none");
        this.activeChatTarget = null;
    }

    bindEvents() {
        this.menuElement.addEventListener("click", (e) => {
            const favClick = e.target.closest('[data-action="execute-fav"]');
            if (favClick && this.activeChatTarget) {
                const targetId = this.activeChatTarget.id;
                e.stopPropagation();
                this.hideMenu();
                this.onToggleFavourite(targetId);
            }
        });

        document.addEventListener("click", () => this.hideMenu());
        window.addEventListener("scroll", () => this.hideMenu(), true);
    }
}

class ChatWindowComponent {
    constructor() {
        this.messageFeed = document.querySelector(".message-feed")
        this.chatInput = document.querySelector(".chat-input")
        this.headerName = document.querySelector(".chat-window-username")
        this.headerAvatar = document.querySelector(".chat-window-img")

        this.landingViewPanel = document.querySelector("#landingViewPanel");
        this.activeConversationPanel = document.querySelector("#activeConversationPanel");
    }
    updateHeader(contact) {
        this.headerName.textContent = contact.name
        this.headerAvatar.src = contact.avatar
    }

    toggleViewState(hasActiveChat) {
        if (hasActiveChat) {
            this.landingViewPanel.classList.add("d-none");
            this.activeConversationPanel.classList.remove("d-none");
        } else {
            this.landingViewPanel.classList.remove("d-none");
            this.activeConversationPanel.classList.add("d-none");
        }
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
        this.scrollToBottom();
    }

    getInputValue() {
        return this.chatInput.value.trim();
    }
    clearInput() {
        this.chatInput.value = "";
    }
    scrollToBottom() {
        this.messageFeed.scrollTop = this.messageFeed.scrollHeight;
    }
}


class ProfileComponent {
    constructor() {
        this.panel = document.querySelector(".profileInfo");
        this.nameElem = document.querySelector(".display-name");
        this.phoneElem = document.querySelector(".display-phone");
        this.avatarElem = document.querySelector(".profileInfo .avatar-img");
        this.about = document.querySelector(".about-text");

    }

    updateProfileDetails(contact) {
        this.nameElem.textContent = contact.name;
        this.phoneElem.textContent = contact.phone;
        this.about.textContent = contact.about;
        this.avatarElem.src = contact.avatar;
    }

    toggleView(show = true) {
        if (show) this.panel.classList.add("active");
        else this.panel.classList.remove("active");
    }
}


class WhatsAppApplication {
    constructor() {
        this.chatsPool = []
        this.activeChatId = null
        this.sentBtn = document.querySelector(".sent-btn")
        this.chatWindow = new ChatWindowComponent()
        this.sidebar = new SidebarComponent()
        this.profilePanel = new ProfileComponent()

        this.darkModeToggle = document.querySelector("#darkModeToggle");

        this.contextMenu = new ContextMenuComponent(this.handleToggleFavourite.bind(this));

    }

    init() {
        this.loadData()
        this.renderAll()
    }

    toggleTheme() {
        console.log("dark modeeee")
        const darkModeActive = document.body.classList.toggle("dark-theme");
    }

    handleToggleFavourite(chatId) {
        const targetChat = this.chatsPool.find(c => c.id === chatId);
        if (targetChat) {
            targetChat.isFavourite = !targetChat.isFavourite;
            this.saveToStorage();
            this.renderAll();
        }
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
                ],
                unreadCount: 0,
                isFavourite: false
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
                ],
                unreadCount: 0,
                isFavourite: false
            },
            {
                id: 3, name: "User 3", phone: "+91 7777777777", about: "Just Living!",
                avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
                messages: [
                    { id: 1, text: "Hii", time: "09:24 pm", timestamp: Date.now() - 50000, type: "received" },
                    { id: 2, text: "Hii", time: "09:24 pm", timestamp: Date.now() - 40000, type: "sent" }
                ],
                unreadCount: 0,
                isFavourite: false
            }, {
                id: 4, name: "User 4", phone: "+91 6666666666", about: "Just Living!",
                avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
                messages: [
                    { id: 1, text: "Hii", time: "09:20 pm", timestamp: Date.now() - 50000, type: "received" },
                    { id: 2, text: "Hii", time: "09:22 pm", timestamp: Date.now() - 42000, type: "sent" }
                ],
                unreadCount: 0,
                isFavourite: false
            }, {
                id: 5, name: "User 5", phone: "+91 5555555555", about: "Just Living!",
                avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
                messages: [
                    { id: 1, text: "Hii", time: "09:16 pm", timestamp: Date.now() - 50000, type: "received" },
                    { id: 2, text: "Hii", time: "09:18 pm", timestamp: Date.now() - 43000, type: "sent" }
                ],
                unreadCount: 0,
                isFavourite: false
            }]
        }
    }

    handleChatSelection(chatId) {
        this.activeChatId = chatId;
        this.chatWindow.toggleViewState(true)
        this.renderAll();
    }
    saveToStorage() {
        localStorage.setItem("chatListData", JSON.stringify(this.chatsPool));
    }

    renderAll() {
        const activeChat = this.chatsPool.find(c => c.id === this.activeChatId);
        this.sidebar.chatListRender(this.chatsPool, activeChat ? activeChat.id : null, this.handleChatSelection.bind(this),)
        if (activeChat) {
            this.chatWindow.renderFeed(activeChat)
            this.chatWindow.updateHeader(activeChat)
            this.profilePanel.updateProfileDetails(activeChat)
        }

    }

    executeMessageSend() {
        const message = this.chatWindow.getInputValue()
        if (message === "") return;

        const activeChat = this.chatsPool.find(c => c.id === this.activeChatId);

        const newMsg = new Message(message, "sent");
        activeChat.messages.push(newMsg);
        this.saveToStorage();

        this.chatWindow.clearInput();
        this.renderAll();
        this.triggerAutoReply(activeChat);
    }


    triggerAutoReply(chatToReply) {
        setTimeout(() => {

            const randomIndex = Math.floor(Math.random() * PRELOADED_REPLIES.length);
            const replyText = PRELOADED_REPLIES[randomIndex];

            const incomingMsg = new Message(replyText, "received");


            chatToReply.messages.push(incomingMsg);

            if (this.activeChatId !== chatToReply.id) {
                chatToReply.unreadCount = (chatToReply.unreadCount || 0) + 1;
            }

            this.saveToStorage();
            this.renderAll();
            console.log(this.chatsPool)
        }, 3000);
    }
}

const obj = new WhatsAppApplication()
obj.init()
