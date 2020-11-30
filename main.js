const url = 'http://localhost:3000/movies'

//  funciton to get movies
function getMovies () {
    fetch (url) 
    .then (res => res.json())
    .then (data => console.log(data))
    // add call to function render
}  

function createMovie () {
    fetch (url) {
        method: POST
    }
}








