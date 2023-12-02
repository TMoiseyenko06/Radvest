
const apiKey = 'AIzaSyBRHG5LtuK_OD0JxmajOOGqT8GSmJNsqBI';
const channelId = 'UCPHrq5PCfCOE2wVTTNFakag';
const maxResults = 4; 

function embedLatestVideos(videos) {
    const videosContainer = document.getElementById('videos-container');

    videos.forEach(video => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${video.id.videoId}`;
        iframe.width = 320; 
        iframe.height = 180; 
        iframe.allowFullscreen = true;

        videosContainer.appendChild(iframe);
    });
}

async function getLatestVideos() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=${maxResults}&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items) {
            embedLatestVideos(data.items);
        } else {
            console.error('Error fetching videos:', data.error.message);
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}


getLatestVideos();