const observer = new MutationObserver((mutations) => {
    Array.from(document.getElementsByClassName("m-auto text-base px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5"))
        .forEach((textbox) => {
            if (!textbox.nextElementSibling || textbox.nextElementSibling.tagName !== 'BUTTON') {
                const button = document.createElement('button');
                const link = document.createElement('a');

                // Add click event to capture text when button is clicked
                button.addEventListener('click', () => {
                    const messages = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.dark');
                    if (messages.length > 0) {
                        const lastMessage = messages[messages.length - 1].innerText;
                        chrome.storage.local.set({ lastAnswer: lastMessage }, () => {
                            console.log('Text saved:', lastMessage);
                        });
                    }
                });

                link.href = chrome.runtime.getURL('assignment.html');
                link.innerHTML = 'Convert to assignment';
                link.style.textDecoration = 'none';
                link.style.color = 'inherit';
                link.target = '_blank';

                button.appendChild(link);
                button.style.width = 'auto';
                button.style.height = 'auto';
                button.style.marginLeft = '10px';
                button.style.padding = '5px 10px';
                button.style.border = '1px solid #ccc';
                button.style.borderRadius = '5px';
                button.style.cursor = 'pointer';

                textbox.parentNode.insertBefore(button, textbox.nextSibling);
            }
        });
});

observer.observe(document.body, { subtree: true, childList: true });
