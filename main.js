/* globals fetch, moment */

const url = 'http://localhost:3000/movies'
const searchForm = document.querySelector('#movie-form-2')
const movieDisplay = document.querySelector('#display')
const displayHolder = document.querySelector('#display-holder')
const movieDisplayA = document.querySelector('#display-a')
const movieDisplay2 = document.querySelector('#display-2')
const movieDisplayB = document.querySelector('#display-b')
const posterPrefix = 'https://image.tmdb.org/t/p/w200'
const dbPrefix = 'https://api.themoviedb.org/3/search/movie?api_key=cdea2b0b411e1e124dcdfb6985b46497&query='

searchForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const searchTerm = document.getElementById('movie-search').value
  console.log(searchTerm)
  searchMovies(searchTerm)
})

movieDisplay.addEventListener('click', function (event) {
  event.preventDefault()
  if (event.target.classList.contains('move')) {
    if (event.target.classList.contains('not-watched')) {
      updateWatched(event.target.parentElement.parentElement.parentElement.id, true)
    } else {
      updateWatched(event.target.parentElement.parentElement.parentElement.id, false)
    }
  } else if (event.target.classList.contains('delete-button')) {
    deleteMovie(event.target.parentElement.parentElement.id)
  }
  if (event.target.classList.contains('movie-title') || event.target.classList.contains('poster')) {
    displayHolder.innerHTML = ''
    renderTop(event.target)
  }
})

movieDisplay2.addEventListener('click', function (event) {
  if (event.target.classList.contains('save')) {
    console.log('I clicked save')
    createMovie(event.target.parentElement)
  }
})

function searchMovies (searchTerm) {
  console.log('running searchMovies')
  movieDisplay2.innerHTML = ''
  fetch(dbPrefix + encodeURI(searchTerm))
    .then(res => res.json())
    .then(data => {
      for (const movie of data.results) {
        showResults(movie, movieDisplay2)
      }
    })
}
function getMovies () {
  movieDisplayA.innerHTML = ''
  movieDisplayB.innerHTML = ''
  fetch(url)
    .then(res => res.json())
    .then(data => {
      for (const movie of data) {
        renderMovie(movie)
      }
    })
}

function createMovie (obj) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: obj.innerText,
      overview: obj.nextSibling.innerText,
      poster_path_url: obj.previousElementSibling.firstElementChild.id,
      watched: false,
      movie_id: obj.id,
      created_at: moment().format('llll')
    })
  })
    .then(res => res.json())
    .then(data => {
      getMovies()
    })
}

function deleteMovie (id) {
  fetch(`${url}/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      getMovies()
    })
}

function updateWatched (id, watchedStatus) {
  fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      watched: watchedStatus,
      modified_at: moment().format('llll')
    })
  })
    .then(res => res.json())
    .then(data => {
      getMovies()
    })
}

function updateNotWatched (id) {
  fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      watched: false,
      modified_at: moment().format('llll')
    })
  })
    .then(res => res.json())
    .then(data => {
      getMovies()
    })
}

getMovies()

function renderMovie (movie) {
  const movieMain = document.createElement('div')
  movieMain.classList.add('movie-card')
  const movieTitle = document.createElement('div')
  movieTitle.classList.add('movie-title')
  movieTitle.id = movie.id
  const moviePoster = document.createElement('div')
  moviePoster.classList.add('movie-poster')

  if (movie.watched === true) {
    movieDisplayB.appendChild(movieMain)
    movieTitle.innerHTML = `<p class='movie-title' data-synopsis="${movie.overview}" data-poster="${movie.poster_path_url}">${movie.title}<i class='fas fa-times delete-button'><i class='fa-toggle-on move watched'></p>`
  } else if (movie.watched === false) {
    movieDisplayA.appendChild(movieMain)
    movieTitle.innerHTML = `<p class='movie-title' data-synopsis="${movie.overview}" data-poster="${movie.poster_path_url}">${movie.title}<i class='fas fa-times delete-button'><i class='fas fa-toggle-off move not-watched'></p>`
  }

  movieMain.appendChild(moviePoster)
  movieMain.appendChild(movieTitle)
  moviePoster.innerHTML = `<img class='poster' data-synopsis="${movie.overview}" data-poster="${movie.poster_path_url}" src=${movie.poster_path_url}></img>`
}

function renderTop (obj) {
  const movieCard = document.createElement('div')
  movieCard.classList.add('top-card')
  displayHolder.appendChild(movieCard)
  const moviePoster = document.createElement('div')
  moviePoster.classList.add('movie-poster')
  const movieOverview = document.createElement('div')
  movieOverview.classList.add('movie-synopsis')
  
  const movieTitle = document.createElement('div')
  movieTitle.classList.add('movie-title')
  movieCard.appendChild(moviePoster)
  movieCard.appendChild(movieOverview)
  movieOverview.innerHTML = obj.dataset.synopsis
  moviePoster.innerHTML = `<img class='poster-top' src=${obj.dataset.poster}></img>`
}
function showResults (movie, display) {
  const movieMain = document.createElement('div')
  movieMain.classList.add('not-watched')
  const movieTitle = document.createElement('div')
  const movieOverview = document.createElement('div')
  const moviePoster = document.createElement('div')

  movieTitle.classList.add('movie-title')
  //set this id to id from database -- post if selected
  movieTitle.id = movie.id
  movieOverview.classList.add('movie-overview')
  moviePoster.classList.add('movie-poster')

  let posterUrl = ''
  if (movie.poster_path === null) {
    posterUrl = '/pexels-skitterphoto-390089.jpg'
  } else {
    posterUrl = posterPrefix + movie.poster_path
  }

  display.appendChild(movieMain)
  movieMain.appendChild(moviePoster)
  movieMain.appendChild(movieTitle)
  movieMain.appendChild(movieOverview)

  movieTitle.innerHTML = `${movie.title}<i class='fas fa-share-square save'></i></i>`
  movieOverview.innerHTML = movie.overview
  moviePoster.innerHTML = `<img class='poster' id =${posterUrl} src=${posterUrl}></img>`
}
