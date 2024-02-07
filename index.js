
const apiKey = 'AIzaSyBRHG5LtuK_OD0JxmajOOGqT8GSmJNsqBI';
const channelId = 'UCPHrq5PCfCOE2wVTTNFakag';
const maxResults = 4; 

function embedLatestVideos(videos) {
    const videosContainer = document.getElementById('videos-container');

    // Sort videos by publishedAt in descending order
    videos.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));

    // Clear the container before adding new iframes
    videosContainer.innerHTML = '';

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


function createDivForEachObject(data) {
    var container = document.getElementById('container'); 
    var vid = JSON.parse(s);
    data.forEach(function(obj) {

      var name = vid.name;
      var preacher = vid.preacher;
      var description = vid.description;
      var link = vid.videoLink;
      var date = vid.date;
      var img = vid.imgPath;

      var div = document.createElement('div');
      
      var nameElement = document.createElement('h1');
      nameElement.textContent = name;
      var dateElement = document.createElement('p');
      dateElement.textContent = date;
      
      
      div.appendChild(nameElement);
      
      
      container.appendChild(div);
    });
  }
  
  
  fetch('1.json')
    .then(response => response.json()) 
    .then(jsonData => {
      createDivForEachObject(jsonData); 
    })
    .catch(error => {
      console.error('Error fetching JSON: ', error);
    });
  


getLatestVideos();




