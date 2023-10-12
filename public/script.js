//TOGGLE FUNCTION OFR POSTS ON HOME PAGE

function toggleContent(postId) {
    const contentElement = document.getElementById(`postContent${postId}`);
    contentElement.classList.toggle('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    
});
