const factList = document.querySelector('#fact-list');

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
            
            const deleteButton = document.createElement('button');
            deleteButton.innerText = '❌';
            deleteButton.addEventListener('click', () => deleteFact(fact.id));
            factItem.appendChild(deleteButton);

            
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

const commentForm = document.getElementById('comment-form');
const submitButton = commentForm.querySelector('button[type="submit"]');


submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const comment = document.getElementById('comment').value;
  
  const data = {
    name,
    comment,
  };

  fetch('https://localhost:3000/comments', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (response.ok) {
      alert('Comment submitted successfully!');
    } else {
      alert('There was a problem submitting your comment.');
    }
  })
  .catch((error) => {
    console.error('Error submitting comment:', error);
    alert('There was a problem submitting your comment.');
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


const addFactForm = document.querySelector('#add-fact-form');

// Handle add fact form submissions
addFactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const topicInput = document.querySelector('#topic-input').value;
  const factInput = document.querySelector('#fact-input').value;
  const sourceInput = document.querySelector('#source-input').value;

  const payload = {    
    topic: topicInput,
    fact: factInput,
    source: sourceInput
  };

  fetch('http://localhost:3000/facts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to add fact');
    }
    return response.json();
  })
  .then((fact) => {
    console.log(`New fact added: ${fact.fact}`);

    // Create a new list item element for the new fact
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
    factText.innerText = `${fact.topic}: ${fact.fact} (${fact.source})`;            
    factItem.appendChild(factText);
    factItem.appendChild(likes);
    factItem.appendChild(neutralEmoji);
    factItem.appendChild(interestingEmoji);
    factItem.appendChild(boringEmoji);

    const speakButton = document.createElement('button');
    speakButton.innerText = '🔊';
    speakButton.addEventListener('click', () => speakText(`${fact.topic}: ${fact.fact}`));
    factItem.appendChild(speakButton);

    factList.appendChild(factItem);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    addFactForm.reset();
  });
});



function deleteFact(factId) {
    fetch(`http://localhost:3000/facts/${factId}`, {
      method: 'DELETE'
    })
    .then((response) => {
      if (response.ok) {
        console.log(`Fact ${factId} deleted`);
        const factItem = document.getElementById(`fact-${factId}`);
        factList.removeChild(factItem);
      } else {
        console.error(`Failed to delete fact ${factId}: ${response.status} ${response.statusText}`);
      }
    })
    .catch((error) => {
      console.error(`Error deleting fact ${factId}:`, error);
    });
  }
  
