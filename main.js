const url = 'http://localhost:3000/movies'

const submitButton = document.querySelector('#submit-button')
const form = document.querySelector('#movie-form')
submitButton.addEventListener('submit', function (event) {
  event.preventDefault()
  createMovie()
})
//  funciton to get movies
function getMovies () {
  fetch (url) 
    .then (res => res.json())
    .then (data => console.log(data))
    // add call to function render
}

function createMovie () {
  const getInput = document.querySelector('input').value

  fetch (url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      title: getInput,
      //    put the innerText here
      watched: 'watched'
    })
  })
}








