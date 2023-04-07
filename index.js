const factList = document.querySelector('#fact-list');
const commentForm = document.getElementById('comment-form');


// Retrieve fun facts data from the API
fetch("http://localhost:3000/facts")
    .then((response) => response.json())
    .then((facts) => {
        
        
        facts.forEach((fact) => {
            const factItem = document.createElement('li');
            const likes = document.createElement('span');
            likes.innerText = 'likes: ';
            const neutralEmoji = document.createElement('button');
            neutralEmoji.innerText = '😐';
            neutralEmoji.addEventListener('click', () => likeFact(fact.id, 'neutral'));
            const interestingEmoji = document.createElement('button');
            interestingEmoji.innerText = '😍';
            interestingEmoji.addEventListener('click', () => likeFact(fact.id, 'interesting'));
            const boringEmoji = document.createElement('button');
            boringEmoji.innerText = '🥱';
            boringEmoji.addEventListener('click', () => likeFact(fact.id, 'boring'));
            const factText = document.createElement('p');
            factText.innerText = fact.fact;            
            factItem.appendChild(factText);
            factList.appendChild(factItem);
            factItem.appendChild(likes);
            factItem.appendChild(neutralEmoji);
            factItem.appendChild(interestingEmoji);
            factItem.appendChild(boringEmoji);

            const speakButton = document.createElement('button');
            speakButton.innerText = '🔊';
            speakButton.addEventListener('click', () => speakText(fact.fact));
            factItem.appendChild(speakButton);

            
        });
    });
   
    // Handle like button click events
function likeFact(factId, rating) {
    console.log(`Fact ${factId} was rated ${rating}`);
    const payload = { rating };
    fetch(`http://localhost:3000/facts/${factId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then((response) => {
        if (response.ok) {
            console.log(`Fact ${factId} rating updated to ${rating}`);
        } else {
            console.error(`Failed to update fact ${factId} rating: ${response.status} ${response.statusText}`);
        }
    })
    .catch((error) => {
        console.error(`Error updating fact ${factId} rating:`, error);
    });
}


// Handle comment form submissions  
commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const commentInput = document.getElementById('comment-input').value;
    const payload = { text: commentInput };

    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to add comment');
        }
        return response.json();
    })
    .then((comment) => {
        console.log(`New comment added: ${comment.text}`);
        
        // Create a new list item element for the new comment
        const commentItem = document.createElement('li');
        commentItem.innerText = comment.text;

        // Append the new comment to the comment list
        commentList.appendChild(commentItem);
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        commentForm.reset();
    });
});

// Text-to-speech function
function speakText(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.addEventListener('end', () => {
        synth.cancel();
    });
    synth.speak(utterance);
}