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
    const yearDropdownBtn = document.getElementById('year-dropdown-btn');
    const yearDropdownContent = document.getElementById('year-dropdown-content');
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

            if (!archiveData[year]) archiveData[year] = [];
            archiveData[year].push(video);
        });

        // Build the year dropdown menu
        for (const year in archiveData) {
            const yearBtn = document.createElement('button');
            yearBtn.innerText = year;
            yearBtn.addEventListener('click', () => showMonths(year));

            yearDropdownContent.appendChild(yearBtn);
        }

        function showMonths(selectedYear) {
            const months = archiveData[selectedYear];
            const monthDropdownContent = createDropdownContent();

            for (const month of months) {
                const monthBtn = document.createElement('button');
                monthBtn.innerText = new Date(month.snippet.publishedAt).toLocaleString('default', { month: 'long' });
                monthBtn.addEventListener('click', () => showDays(month));

                monthDropdownContent.appendChild(monthBtn);
            }

            positionDropdown(monthDropdownContent, yearDropdownBtn);
        }

        function showDays(selectedMonth) {
            const days = archiveData[selectedMonth.snippet.publishedAt.getFullYear()][selectedMonth.snippet.publishedAt.getMonth() + 1];
            const dayDropdownContent = createDropdownContent();

            for (const day of days) {
                const dayBtn = document.createElement('button');
                dayBtn.innerText = new Date(day.snippet.publishedAt).getDate();
                dayBtn.addEventListener('click', () => showVideos(day));

                dayDropdownContent.appendChild(dayBtn);
            }

            positionDropdown(dayDropdownContent, yearDropdownBtn);
        }

        function showVideos(selectedDay) {
            // Display videos for the selected day
            videoContainer.innerHTML = '';

            selectedDay.forEach(video => {
                const videoItem = createVideoItem(video);
                videoContainer.appendChild(videoItem);
            });
        }

        function createDropdownContent() {
            const dropdownContent = yearDropdownContent.cloneNode(true);
            dropdownContent.style.display = 'block';
            document.body.appendChild(dropdownContent);
            return dropdownContent;
        }

        function positionDropdown(dropdownContent, referenceElement) {
            const rect = referenceElement.getBoundingClientRect();
            dropdownContent.style.left = rect.left + 'px';
            dropdownContent.style.top = rect.bottom + 'px';

            // Close the dropdown content when clicking outside of it
            document.addEventListener('click', closeDropdown);

            function closeDropdown(event) {
                if (!event.target.closest('#dropdown-container')) {
                    dropdownContent.style.display = 'none';
                    document.removeEventListener('click', closeDropdown);
                }
            }
        }

        // Close the dropdown content when clicking outside of it
        document.addEventListener('click', closeDropdown);

        function closeDropdown(event) {
            if (!event.target.closest('#dropdown-container')) {
                yearDropdownContent.style.display = 'none';
                document.removeEventListener('click', closeDropdown);
            }
        }
    });
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
