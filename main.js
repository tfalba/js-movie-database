const url = 'http://localhost:3000/movies'

const submitButton = document.querySelector('#submit-button')
const form = document.querySelector('#movie-form')
const movieInput = document.querySelector('#movie-input')
const movieDisplay = document.querySelector('#display')
form.addEventListener('submit', function (event) {
  event.preventDefault()
  
  createMovie()
})
//  funciton to get movies
function getMovies () {
  movieDisplay.innerHTML = ''
  fetch (url) 
    .then (res => res.json())
    .then (data => {
    for (let movie of data){
      renderMovie (movie)
   }})
}

function createMovie () {
  const getInput = document.querySelector('input').value

  fetch (url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      title: getInput,
      //    put the innerText here
      watched: false
    })
  })
  getMovies()
  movieInput.value = ''
}

function updateMovie(id) {
    fetch (`${url}/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( {
          watched: true
        })
    })
}

getMovies()

function renderMovie (movie) {
 const movieMain = document.createElement('div')
 movieDisplay.appendChild(movieMain) 
 const movieTitle = document.createElement('div')
 movieMain.appendChild(movieTitle)
 movieTitle.innerHTML = movie.title
 // Write an outer div to be container for housing movieMain
 // and watch box
 // Append both of those to parent movieDisplay
 //const checkWatched = document.createElement('input')
 //checkWatched.type='checkbox'
 //movieMain.appendChild(checkWatched)
 const watchButton = document.createElement('button')
 watchButton.classList.add('watch-button')
 movieMain.appendChild(watchButton)
 watchButton.innerHTML = 'watched'



}

movieDisplay.addEventListener('click', function (event) {
  event.preventDefault()
  if (event.target.classList.contains('watch-button')) {
    // debugger
    (console.log(event.target))

  }

}) 


