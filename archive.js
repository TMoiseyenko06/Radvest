// Replace with your API key and channel ID
const API_KEY = 'AIzaSyBRHG5LtuK_OD0JxmajOOGqT8GSmJNsqBI';
const CHANNEL_ID = 'UCPHrq5PCfCOE2wVTTNFakag';

// Load the YouTube API client library
gapi.load('client', init);

function init() {
    // Initialize the API client library
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    }).then(() => {
        // Call the function to build the archive
        buildArchive();
    });
}

function buildArchive() {
    const archiveElement = document.getElementById('archive');
    const videoContainer = document.getElementById('video-container');

    // Fetch videos from the YouTube channel
    gapi.client.youtube.search.list({
        part: 'snippet',
        channelId: CHANNEL_ID,
        order: 'date',
        maxResults: 50,
    }).then(response => {
        const videos = response.result.items;

        // Organize videos by year, month, and day
        const archiveData = {};
        videos.forEach(video => {
            const date = new Date(video.snippet.publishedAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Month is zero-based
            const day = date.getDate();

            if (!archiveData[year]) archiveData[year] = {};
            if (!archiveData[year][month]) archiveData[year][month] = {};
            if (!archiveData[year][month][day]) archiveData[year][month][day] = [];

            archiveData[year][month][day].push(video);
        });

        // Build the archive buttons
        for (const year in archiveData) {
            const yearButton = createButton(year, () => showMonths(year));
            archiveElement.appendChild(yearButton);

            // Initially, only display the current year's months
            if (year == new Date().getFullYear()) {
                showMonths(year);
            }

            function showYears() {
                const years = Object.keys(archiveData);
                const yearButtons = [];
        
                for (const year of years) {
                    const yearButton = createButton(year, () => toggleVisibility(year));
                    yearButtons.push(yearButton);
                }
        
                // Display year buttons in the archive
                const buttonContainer = createButtonContainer(yearButtons);
                buttonContainer.classList.add('years-container');
                archiveElement.appendChild(buttonContainer);
        
                function toggleVisibility(selectedYear) {
                    const container = buttonContainer.querySelector('.years-container');
                    const yearIndex = Array.from(container.children).findIndex(child => child.innerText === selectedYear);
        
                    if (container.children[yearIndex + 1].style.display === 'none') {
                        container.children[yearIndex + 1].style.display = 'block';
                    } else {
                        container.children[yearIndex + 1].style.display = 'none';
                        // If you want to also hide the month and day buttons, add similar loops here
                    }
                }
        
                // Initially hide the year buttons
                toggleVisibility(years[0]);
            }
        
            function showDays(selectedYear, selectedMonth) {
                const days = archiveData[selectedYear][selectedMonth];
                const dayButtons = [];
        
                for (const day in days) {
                    const dayButton = createButton(day, () => showVideos(days[day]));
                    dayButtons.push(dayButton);
                }
        
                // Display day buttons under the respective month
                const monthIndex = Array.from(archiveElement.children).findIndex(child => child.innerText === selectedMonth);
                const buttonContainer = createButtonContainer(dayButtons);
                buttonContainer.classList.add('days-container');
                archiveElement.insertBefore(buttonContainer, archiveElement.children[monthIndex + 1]);
        
                function showVideos(videos) {
                    // Display videos for the selected day
                    videoContainer.innerHTML = '';
        
                    videos.forEach(video => {
                        const videoItem = createVideoItem(video);
                        videoContainer.appendChild(videoItem);
                    });
                }
            }
        }
    });
}

function createButton(text, onClick) {
    const button = document.createElement('div');
    button.className = 'button';
    button.innerText = text;
    button.addEventListener('click', onClick);
    return button;
}

function createButtonContainer(buttons) {
    const container = document.createElement('div');
    container.className = 'button-container';
    container.append(...buttons);
    return container;
}

function createVideoItem(video) {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';

    const thumbnail = document.createElement('img');
    thumbnail.src = video.snippet.thumbnails.medium.url;

    const title = document.createElement('div');
    title.innerText = video.snippet.title;

    videoItem.append(thumbnail, title);

    return videoItem;
}
