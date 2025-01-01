// project1.js

let highestZIndex = 1000; // Initialize the highest z-index value

function makeElementDraggable(elementId) {
    const element = document.getElementById(elementId);
    let isDragging = false;

    // Variables to store initial mouse and element positions
    let mouseOffsetX = 0;
    let mouseOffsetY = 0;

    // Disable default drag behavior
    element.addEventListener('dragstart', (e) => e.preventDefault());

    element.addEventListener('mousedown', (e) => {
        isDragging = true;

        // Increase z-index of the dragged element
        highestZIndex += 1; // Increment the z-index
        element.style.zIndex = highestZIndex;

        // Calculate offset between mouse pointer and element center
        const rect = element.getBoundingClientRect();
        mouseOffsetX = e.clientX - rect.left;
        mouseOffsetY = e.clientY - rect.top;

        // Change the cursor to grabbing
        element.style.cursor = 'grabbing';

        const onMouseMove = (e) => {
            if (isDragging) {
                // Update element position relative to the mouse while maintaining offset
                element.style.left = `${e.clientX - mouseOffsetX}px`;
                element.style.top = `${e.clientY - mouseOffsetY}px`;
            }
        };

        const onMouseUp = () => {
            isDragging = false;

            // Restore cursor
            element.style.cursor = 'grab';

            // Remove event listeners to prevent memory leaks
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        // Attach event listeners for dragging
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Make all scattered elements draggable
makeElementDraggable('draggable-image-1');
makeElementDraggable('draggable-image-2');
makeElementDraggable('draggable-image-3');
makeElementDraggable('draggable-video'); // Make the video draggable

