/* globals fetch, moment */

const url = 'http://localhost:3000/movies'
const searchForm = document.querySelector('#movie-form-2')
const movieDisplay = document.querySelector('#display')
const displayHolder = document.querySelector('#display-holder')
const movieDisplayA = document.querySelector('.display-a')
const movieDisplay2 = document.querySelector('#display-2')
const movieDisplayB = document.querySelector('.display-b')
const toWatchTab = document.querySelector('#to-watch-tab')
const watchedTab = document.querySelector('#watched-tab')
const posterPrefix = 'https://image.tmdb.org/t/p/w200'
const dbPrefix = 'https://api.themoviedb.org/3/search/movie?api_key=cdea2b0b411e1e124dcdfb6985b46497&query='

displayHolder.addEventListener('click', function (event) {
  if (event.target.classList.contains('close-me')) {
    displayHolder.innerHTML = ''
    modal.innerText = ''
    modal.style.display = 'none'
  }
})

watchedTab.addEventListener('click', function () {
  watchedTab.classList.toggle('dim-me')
  movieDisplayB.classList.toggle('hide-me')
  if (watchedTab.classList.contains('dim-me')) {
    watchedTab.innerText = 'Watched Movies o'
  } else {
    watchedTab.innerText = 'Watched Movies x'
  }
})
toWatchTab.addEventListener('click', function () {
  toWatchTab.classList.toggle('dim-me')
  movieDisplayA.classList.toggle('hide-me')
  if (toWatchTab.classList.contains('dim-me')) {
    toWatchTab.innerText = 'Movies to Watch o'
  } else {
    toWatchTab.innerText = 'Movies to Watch x'
  }
})

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
  // if (event.target.classList.contains('movie-title') || event.target.classList.contains('poster')) {
  //   displayHolder.innerHTML = ''
  //   renderTop(event.target)
  // }
})

movieDisplay2.addEventListener('click', function (event) {
  if (event.target.classList.contains('save')) {
    console.log('I clicked save')
    createMovie(event.target.parentElement)
    event.target.parentElement.parentElement.classList.add('hide-me')
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
      //getMovieDetail()
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

function renderMovie (movie) {
  const movieMain = document.createElement('div')
  movieMain.classList.add('movie-card')
  const movieTitle = document.createElement('div')
  movieTitle.classList.add('movie-title')
  movieTitle.id = movie.id
  const moviePoster = document.createElement('div')
  moviePoster.classList.add('movie-poster')
  // moviePoster.id = movie.movie_id

  if (movie.watched === true) {
    movieDisplayB.appendChild(movieMain)
    movieTitle.innerHTML = `<p class='movie-title' data-synopsis="${movie.overview}" data-poster="${movie.poster_path_url}" data-title="${movie.title}">${movie.title}<i class='fas fa-times delete-button'><i class='fa-toggle-on move watched'></p>`
  } else if (movie.watched === false) {
    movieDisplayA.appendChild(movieMain)
    movieTitle.innerHTML = `<p class='movie-title' data-synopsis="${movie.overview}" data-poster="${movie.poster_path_url}" data-title="${movie.title}">${movie.title}<i class='fas fa-times delete-button'><i class='fas fa-toggle-off move not-watched'></p>`
  }

  movieMain.appendChild(moviePoster)
  movieMain.appendChild(movieTitle)
  moviePoster.innerHTML = `<img id ='${movie.movie_id}' class='poster' data-synopsis="${movie.overview}" data-poster="${movie.poster_path_url}" data-title="${movie.title}" src=${movie.poster_path_url}></img>`
}
function playTrailer (key) {
  // const videoDisplay = document.createElement('iframe')
  // displayHolder.appendChild(videoDisplay)
  console.log(`'https:/www.youtube.come/embed/${key}'`)
  displayHolder.innerHTML = `<p class='close-me'>X</p><iframe width="680" height="350" src='https://www.youtube.com/embed/${key}'></iframe>`
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
  movieMain.classList.add('search-card')
  const movieTitle = document.createElement('div')
  const movieOverview = document.createElement('div')
  const moviePoster = document.createElement('div')

  movieTitle.classList.add('movie-title')
  // set this id to id from database -- post if selected
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

getMovies()

/* ------------------------------------------------------------------------------------------------------------------ */
/*                         Trying modal pop out setup from w3schools                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

// Get the modal
const modal = document.getElementById('myModal')

// Get the button that opens the modal
const btn = document.getElementById('myBtn')

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0]

// When the user clicks the button, open the modal
// btn.onclick = function() {
//   modal.style.display = 'block'
//   renderModal ()
// }

movieDisplay.addEventListener('click', function (event) {
  if (event.target.classList.contains('movie-title')) {
    modal.style.display = 'block'
    modal.innerText = ''
    renderModal(event.target)
  }
  if (event.target.classList.contains('poster')) {
    // debugger
    getTrailer(event.target.id, event.target.parentElement.nextSibling.id)
    modal.style.display = 'block'
    modal.innerText = ''
    renderModal(event.target.parentElement.nextElementSibling.children[0])

  }
})

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  // if (event.target === modal) {
  //   modal.style.display = 'none'
  // }
  // if (event.target.classList.contains('poster') & modal.style.display === 'block') {
  //   modal.style.display = 'none'
  // }
}

function renderModal (obj) {
  const movieCard = document.createElement('div')
  movieCard.classList.add('top-card')
  modal.appendChild(movieCard)
  const movieTitle = document.createElement('div')
  const movieOverview = document.createElement('div')
  movieOverview.classList.add('movie-synopsis')
  movieTitle.classList.add('movie-title-top')
  movieCard.appendChild(movieTitle)
  movieTitle.innerHTML = obj.dataset.title


  movieCard.appendChild(movieOverview)
  movieOverview.innerHTML = obj.dataset.synopsis
}

// Write a request as part of create movie that will nest fetch requests --
// take the movie id from the earlier result that is stored in the object --
// run a fetch request to get the video link to play trailer and save that in object with a patch
// request

function getTrailer(searchId, localId) {
  const urlVideo = `https://api.themoviedb.org/3/movie/${searchId}?api_key=cdea2b0b411e1e124dcdfb6985b46497&append_to_response=videos`
  console.log(urlVideo)
  fetch(urlVideo)
    .then(res => res.json())
    .then(data => {
      // if (data.videos.results.length > 1) {
      //   for (const video of data.videos.results) {
      //     console.log(video)
      //   }
      // } else if (data.videos.results.length === 1) {
      //   console.log(data.videos.results)
      // }
      // console.log(data.videos.results.length)
      console.log(data.videos.results[0].key, localId)
      // debugger
      // saveTrailer(data.videos.results[0].key, localId)
      // use the above to save when first gets created -- for now can just call to renderTop and display video
      playTrailer(data.videos.results[0].key)
    })
}

function saveTrailer (movie, localId) {
  if (movie==='7') {
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
  }}
