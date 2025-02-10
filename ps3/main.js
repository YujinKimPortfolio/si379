
// For the overall code, I got chat GPT's help in getting the overall structure (which function to write first in order to proceed with the next one).
// I also got its help when I faced unexpected output, giving it the screenshot of the screen, and helping me figure out where the error might be coming from. 
// When I couldn't figure out where the error might be coming from, I gave it my function and let it modify the function.

    document.addEventListener("DOMContentLoaded", () => {
    let events = [];   
    let selectedIndex = 0;  
    let timer;   

    getUMEventsWithImages((fetchedEvents) => {
        events = fetchedEvents;
        if (events.length === 0) return; 
        renderThumbnails();
        setSelectedIndex(0);
        startAutoAdvance();
    });
    

    function renderThumbnails() {
        const thumbnailsContainer = document.getElementById("thumbnails");
        thumbnailsContainer.innerHTML = ""; 

        events.forEach((event, index) => {
            const img = document.createElement("img");
            img.src = event.styled_images.event_thumb; 
            img.id = `thumb-${index}`; 
            img.classList.add("thumbnail"); 

            img.addEventListener("click", () => {
                setSelectedIndex(index);
                resetAutoAdvance();
            });

            thumbnailsContainer.appendChild(img);
        });
    }


    function setSelectedIndex(index) {
        if (events[selectedIndex]) {
            document.getElementById(`thumb-${selectedIndex}`).classList.remove("selected");
        }
        selectedIndex = index;
        document.getElementById(`thumb-${selectedIndex}`).classList.add("selected");
        updateEventDetails(events[selectedIndex]);
    }


    function updateEventDetails(event) {
        document.getElementById("selected-title").innerHTML = `<a href="${event.permalink}" target="_blank">${event.event_title}</a>`;
        document.getElementById("selected-image").src = event.image_url;
        document.getElementById("selected-date").textContent = getReadableTime(event.datetime_start);
        document.getElementById("selected-description").innerHTML = event.description || "No description available.";
    }

    function startAutoAdvance() {
        timer = setInterval(() => {
            setSelectedIndex((selectedIndex + 1) % events.length);
        }, 10000); 
    }

    function resetAutoAdvance() {
        clearInterval(timer);
        startAutoAdvance();
    }
});
