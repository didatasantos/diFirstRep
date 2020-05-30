const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster == 'N/A' ? "" : movie.Poster
        return ` 
        <img src="${imgSrc}"/>
        ${movie.Title} (${movie.Year})
        `

    },

    inputValue(movie) {
        return movie.Title
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
                params: {
                    apikey: '73d3b91b',
                    s: searchTerm,

                }
            }) // response tem todos os dados 
        if (response.data.Error) {
            return []
        }
        return response.data.Search
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    },

})
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    },

})

let leftMovie;
let rightMovie;
const onMovieSelect = async(movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '73d3b91b',
            i: movie.imdbID,
        }
    })
    summaryElement.innerHTML = movieTemplate(response.data)
        // console.log(response.data)

    if (side == 'left') {
        leftMovie = response.data
        console.log(leftMovie)
    } else {
        rightMovie = response.data
    }
    if (leftMovie && rightMovie) {
        runComparison()
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStats, index) => {
        const rightStats = rightSideStats[index]

        //dataset recupera o valor do data-value ou qlqr outro data...
        const leftSideValue = pareInt(leftStats.dataset.value)
        const rightSideValue = parseInt(rightStats.dataset.value)

        if (leftSideValue > rightSideValue) {
            leftStats.classList.remove('is-primary')
            leftStats.classList.add('is-warning')
        } else {
            rightStats.classList.remove('is-primary')
            rightStats.classList.add('is-warning')
        }

    })
}
const movieTemplate = movieDetail => {
    // const boxOfficeComp = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '') );
    const metascoreComp = parseInt(movieDetail.Metascore)
    const imdbRatingComp = parseFloat(movieDetail.imdbRating)
    const imdbVotesComp = parseFloat(movieDetail.imdbVotes.replace(/,/g, ''))
    const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
            const value = parseInt(word)
            if (isNaN(value)) { return prev; } else { return prev + value }
        }, 0)
        //console.log(awards)

    //FUNCIONA IGUALMENTE
    // let count = 0
    // const awards = movieDetail.Awards.split(" ").forEach((word) => {
    //     const value = parseInt(word)
    //     if (isNaN(value)) { return; } else { count = count + value }
    // })
    // console.log(count)
    return `
        <article class="media">
          <figure class="media-left">
            <p class="image">
              <img src="${movieDetail.Poster}"/>
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
             <h1>${movieDetail.Title}</h1>
             <h4>${movieDetail.Genre}</h4>
             <p>${movieDetail.Plot}</p>
            </div>
          </div>
        </article>  
        <article data-value=${awards} class="notification is-primary">
             <p class="title">${movieDetail.Awards}</p>
             <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
             <p class="title">${movieDetail.BoxOffice}</p>
             <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascoreComp} class="notification is-primary">
             <p class="title">${movieDetail.Metascore}</p>
             <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRatingComp} class="notification is-primary">
             <p class="title">${movieDetail.imdbRating}</p>
             <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotesComp} class="notification is-primary">
             <p class="title">${movieDetail.imdbVotes}</p>
             <p class="subtitle">IMDB Votes</p>
        </article>


        `
}

//RESPOSTA
// {Title: "Wrong Turn 6: Last Resort - Hobb Springs: A Place To Rest... In Peace", Year: "2014", imdbID: "tt4610762", Type: "movie", Poster: "N/A"}
// Poster: "N/A"
// Title: "Wrong Turn 6: Last Resort - Hobb Springs: A Place To Rest... In Peace"
// Type: "movie"
// Year: "2014"
// imdbID: "tt4610762" - COM A RESPOSTA UTILIZAREMOS O ID PARA FAZER A BUSCA
// __proto__: Object