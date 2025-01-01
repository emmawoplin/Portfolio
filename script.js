const timeline = document.querySelector('.timeline');
const playhead = document.querySelector('.timeline-playhead');
const points = document.querySelectorAll('.point');
const videosTop = document.querySelectorAll('.videos-top video');
const videosBottom = document.querySelectorAll('.videos-bottom video');

let isDragging = false;

// Buffers to extend playhead movement
const buffer = 20; // Allow playhead to move slightly before the first point
const rightBuffer = 20; // Allow playhead to move slightly beyond the last point

// Hide all videos and buttons initially
document.addEventListener('DOMContentLoaded', () => {
    // Set the playhead to the start of the pink bar (buffer zone)
    playhead.style.left = `-${buffer}px`;

    // Ensure all videos and captions are hidden initially
    document.querySelectorAll('.image').forEach(video => {
        video.classList.remove('active');
        video.parentElement.querySelector('.view-project-btn').style.display = 'none'; // Hide buttons
    });
    document.querySelectorAll('.caption').forEach(caption => caption.classList.remove('active'));
});

timeline.addEventListener('mousedown', () => {
    isDragging = true;
    document.body.style.cursor = 'url(Images/cursor_32x32.png), grabbing'; // Custom cursor when dragging
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'url(Images/cursor_32x32.png), auto'; // Return to custom cursor
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = timeline.getBoundingClientRect();
    let x = e.clientX - rect.left;

    // Allow playhead to move slightly beyond both ends of the timeline
    if (x < -buffer) x = -buffer; // Extend left boundary
    if (x > rect.width + rightBuffer) x = rect.width + rightBuffer; // Extend right boundary

    playhead.style.left = `${x}px`;

    points.forEach((point, index) => {
        const pointPosition = point.getBoundingClientRect().left - rect.left;

        if (x >= pointPosition) {
            activateVideo(index); // Activate video when playhead reaches or passes the point
        } else if (x < pointPosition - buffer) {
            deactivateVideo(index); // Deactivate video if playhead moves back before the point
        }
    });
});

function activateVideo(index) {
    const isTop = index % 2 === 0; // Even indices are top videos
    const video = isTop ? videosTop[Math.floor(index / 2)] : videosBottom[Math.floor(index / 2)];
    const caption = video.parentElement.querySelector('.caption');
    const button = video.parentElement.querySelector('.view-project-btn');

    if (video && !video.classList.contains('active')) {
        video.classList.add('active');
        video.play();
    }

    if (caption && !caption.classList.contains('active')) {
        caption.classList.add('active');
    }

    if (button) {
        button.style.display = 'block'; // Show button when video is active
    }

    points[index].classList.add('active');
}

function deactivateVideo(index) {
    const isTop = index % 2 === 0; // Even indices are top videos
    const video = isTop ? videosTop[Math.floor(index / 2)] : videosBottom[Math.floor(index / 2)];
    const caption = video.parentElement.querySelector('.caption');
    const button = video.parentElement.querySelector('.view-project-btn');

    if (video && video.classList.contains('active')) {
        video.classList.remove('active');
        video.pause();
        video.currentTime = 0;
    }

    if (caption && caption.classList.contains('active')) {
        caption.classList.remove('active');
    }

    if (button) {
        button.style.display = 'none'; // Hide button when video is inactive
    }

    points[index].classList.remove('active');
}

// Function to pause all timeline videos
function pauseAllVideos() {
    const videos = document.querySelectorAll(".videos-top video, .videos-bottom video"); // Select all timeline videos
    videos.forEach((video) => {
        video.pause(); // Pause each video
    });
}

// Function to play all timeline videos regardless of the playhead
function playAllVideos() {
    const videos = document.querySelectorAll(".videos-top video, .videos-bottom video"); // Select all timeline videos
    videos.forEach((video) => {
        if (video.readyState > 2) { // Ensure the video is ready to play
            video.play(); // Play each video
        }
    });
}

// Open Modal on Button Click
document.querySelectorAll(".view-project-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default link behavior
        const projectUrl = button.getAttribute("data-project-url");

        pauseAllVideos(); // Pause all timeline videos before opening the modal

        const modal = document.getElementById("projectModal");
        const iframe = document.getElementById("projectIframe");
        iframe.src = projectUrl; // Load the project URL into the iframe
        modal.style.display = "block"; // Show the modal
    });
});

// Close Modal on Close Button Click
const closeModal = document.querySelector(".close");
closeModal.addEventListener("click", () => {
    const modal = document.getElementById("projectModal");
    modal.style.display = "none";
    const iframe = document.getElementById("projectIframe");
    iframe.src = ""; // Clear iframe content to save resources
    playAllVideos(); // Resume timeline videos when modal is closed
});

// Close Modal When Clicking Outside the Modal Content
window.addEventListener("click", (event) => {
    const modal = document.getElementById("projectModal");
    if (event.target === modal) {
        modal.style.display = "none";
        const iframe = document.getElementById("projectIframe");
        iframe.src = ""; // Clear iframe content to save resources
        playAllVideos(); // Resume timeline videos when modal is closed
    }
});

// Ensure the modal is hidden on page load
window.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("projectModal");
    modal.style.display = "none"; // Hide the modal
});
