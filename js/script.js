//
//
//

document.addEventListener('DOMContentLoaded', init);

function init() {
    trendingLoad();
    suggestedLoad();
    checkIfDark();
};

const apiKey = 'CclvPS0iGiXBUBKFuYeM47klAW0kINYG';
const searchGif = document.getElementById('searchButton');
const searchHistory = document.getElementById('searchHistory');
const searchSuggestions = document.getElementById('searchSuggestions');
const searchInput = document.getElementById('searchInput');
const titleSearchOutput = document.getElementById('searchOutputTitle');
const searchOutTitleText = document.getElementById('searchOutTitleText');
let savedGifs = localStorage.getItem('arrayGifs')

//
// LocalStorage Search

let saveHistory = localStorage.getItem('searchHistory');
let historyArray = [];

if (saveHistory === null || saveHistory === undefined) {
    console.log('No saved search query');
} else {
    historyArray.splice(-1, 0, saveHistory.split(','));
    historyArray[0].forEach((q) => {
        const urlHistory = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=4`;
        const outputElement = document.getElementById('searchOutput');
        const searchOutTitleText = document.getElementById('searchOutTitleText');
        const historyButton = document.createElement('button');
        searchHistory.appendChild(historyButton).innerHTML = `#${q}`;

        historyButton.addEventListener('click', () => {
            useRequest(urlHistory).then(response => {
                clearContainer(outputElement);
                appendGif(response, outputElement);
                searchOutTitleText.innerHTML = `${q}`;
                titleSearchOutput.style.display = 'flex';
                scrollMe(searchOutTitleText);
            });
        });
    });
}

//
// Search App

searchGif.addEventListener('click', e => {
    e.preventDefault();

    const q = document.getElementById('searchInput').value;
    const urlApi = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=4`;
    const outputElement = document.getElementById('searchOutput');

    clearContainer(outputElement);
    searchSuggestions.style.display = 'none';

    useRequest(urlApi).then(response => {
        appendGif(response, outputElement);

        function renderTitle() {
            titleSearchOutput.style.display = 'flex';
            searchOutTitleText.innerHTML = `${q}`;
        };

        function saveHistoryButton() {
            const historyButton = document.createElement('button');
            searchHistory.appendChild(historyButton).innerHTML = `#${q}`;
        };

        searchHistorySave(q)
        renderTitle();
        saveHistoryButton();
        scrollMe(searchOutTitleText);
        searchInput.value = '';
        searchInput.placeholder = 'Busca gifs, hashtags, temas, busca lo que quieras…';
        stoppedTyping();
    })
});

//
// Save Search To LocalStorage Fx

function searchHistorySave(q) {
    historyArray.push(q);
    localStorage.setItem('searchHistory', historyArray);
};

//
// Search Suggestions

searchInput.addEventListener('click', () => {
    clearContainer(searchSuggestions);
    searchInput.value = '';
    searchInput.placeholder = '';
    const randomWords = 'https://raw.githubusercontent.com/words/an-array-of-english-words/master/index.json';
    const outputElement = document.getElementById('searchOutput');

    useRequest(randomWords).then(response => {
        const currentSugg = ['', '', ''];

        currentSugg.forEach(() => {
            const newSuggBtn = document.createElement('button');
            searchSuggestions.appendChild(newSuggBtn);
            newSuggBtn.innerHTML = response[Math.floor(Math.random() * response.length)];

            newSuggBtn.addEventListener('click', () => {
                const suggSearchUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${newSuggBtn.innerHTML}&limit=4`;
                clearContainer(outputElement);

                useRequest(suggSearchUrl).then(request => {

                    if (request.data[0] === undefined) {
                        newSuggBtn.innerHTML = 'No se encontraron resultados según la palabra sugerida.'
                    } else {
                        appendGif(request, outputElement);
                        searchSuggestions.style.display = 'none';
                        searchOutputTitle.style.display = 'block';
                        searchOutTitleText.innerHTML = newSuggBtn.innerHTML;
                        clearContainer(searchSuggestions);
                    };
                });
            });
        })

        if (searchSuggestions.style.display === 'flex') {
            searchSuggestions.style.display = 'none';
        } else {
            searchSuggestions.style.display = 'flex';
        }

    });
});

//
// Get Mis Guifos 

const misGuifosButton = document.getElementById('misGuifosButton');
const mainWrapper = document.getElementById('mainWrapper');
const searchSection = document.getElementById('searchSection');

misGuifosButton.addEventListener('click', () => {
    const misGuifosCont = document.createElement('section');
    misGuifosCont.classList.add('mis-guifos');
    const createdTitle = document.createElement('div');
    createdTitle.classList.add('mis-guifos-title');
    const createdTitleText = document.createElement('p');

    if (savedGifs) {
        createdTitleText.innerHTML = 'Mis Guifos';
    } else {
        createdTitleText.innerHTML = 'Aún no creaste ningún Gifo!';
    };

    createdTitle.appendChild(createdTitleText);
    misGuifosCont.appendChild(createdTitle);
    mainWrapper.insertBefore(misGuifosCont, searchSection);
    misGuifosButton.disabled = true;
    getMyGifs(misGuifosCont);
});


//
// Suggested Gifs

function suggestedLoad() {

    let urlS1 = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=coffee&limit=5`;
    let urlS2 = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=cellphone&limit=5`;
    let urlS3 = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=skateboard&limit=5`;
    let urlS4 = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=bike&limit=5`;

    useRequest(urlS1).then(response => {
        const outputElement = document.getElementById('suggestionOne');
        const gifOutput = response.data[1].images.downsized_medium.url;
        const gifAlt = response.data[1].title;
        outputElement.style.backgroundImage = `url(${gifOutput})`;
        outputElement.style.backgroundSize = 'cover';
        outputElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const gifCard1 = document.getElementById('gifCard1');
            downloadButtonAction(gifCard1, gifOutput);
        });
    });

    useRequest(urlS2).then(response => {
        const outputElement = document.getElementById('suggestionTwo');
        const gifOutput = response.data[3].images.downsized_medium.url;
        const gifAlt = response.data[3].title;
        outputElement.style.backgroundImage = `url(${gifOutput})`;
        outputElement.style.backgroundSize = 'cover';
        outputElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const gifCard2 = document.getElementById('gifCard2');
            downloadButtonAction(gifCard2, gifOutput);
        });
    });

    useRequest(urlS3).then(response => {
        const outputElement = document.getElementById('suggestionThree');
        const gifOutput = response.data[1].images.downsized_medium.url;
        const gifAlt = response.data[1].title;
        outputElement.style.backgroundImage = `url(${gifOutput})`;
        outputElement.style.backgroundSize = 'cover';
        outputElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const gifCard3 = document.getElementById('gifCard3');
            downloadButtonAction(gifCard3, gifOutput);
        });
    });

    useRequest(urlS4).then(response => {
        const outputElement = document.getElementById('suggestionFour');
        const gifOutput = response.data[1].images.downsized_medium.url;
        const gifAlt = response.data[1].title;
        outputElement.style.backgroundImage = `url(${gifOutput})`;
        outputElement.style.backgroundSize = 'cover';
        outputElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const gifCard4 = document.getElementById('gifCard4');
            downloadButtonAction(gifCard4, gifOutput);
        });
    });


    const seeMoreOne = document.getElementById('seeMoreOne');
    const seeMoreTwo = document.getElementById('seeMoreTwo');
    const seeMoreThree = document.getElementById('seeMoreThree');
    const seeMoreFour = document.getElementById('seeMoreFour');

    seeMoreOne.addEventListener('click', () => {
        const outputElement = document.getElementById('seeMoreOutput');
        clearContainer(outputElement);
        useRequest(urlS1).then(response => {
            appendGif(response, outputElement);
            scrollMe(outputElement);
        });
    });

    seeMoreTwo.addEventListener('click', () => {
        const outputElement = document.getElementById('seeMoreOutput');
        clearContainer(outputElement);
        useRequest(urlS2).then(response => {
            appendGif(response, outputElement);
            scrollMe(outputElement);
        });
    });

    seeMoreThree.addEventListener('click', () => {
        const outputElement = document.getElementById('seeMoreOutput');
        clearContainer(outputElement);
        useRequest(urlS3).then(response => {
            appendGif(response, outputElement);
            scrollMe(outputElement);
        });
    });

    seeMoreFour.addEventListener('click', () => {
        const outputElement = document.getElementById('seeMoreOutput');
        clearContainer(outputElement);
        useRequest(urlS4).then(response => {
            appendGif(response, outputElement);
            scrollMe(outputElement);
        });
    });

};

//
// Dropdown Menu

const themeButton = document.getElementById('themeButton');
const themeDropdown = document.getElementById('themeDropdown');

themeButton.addEventListener('click', openDropdown);
themeDropdown.addEventListener('click', openDropdown);
const dropdownItems = document.getElementById('dropdownItems');

function openDropdown() {
    dropdownItems.classList.toggle('dropdown-items-show');
};


//
// Dark Mode

let userColorPref = localStorage.getItem('darkMode');
const lightMode = document.getElementById('lightMode');
const darkMode = document.getElementById('darkMode');
const logoNode = document.getElementById('logoNode');
const linkDarkCSS = document.getElementById('linkDarkCSS');

lightMode.addEventListener('click', () => {
    linkDarkCSS.href = '';
    logoNode.src = 'assets/gifOF_logo.png';
    localStorage.setItem('darkMode', null);
    lightMode.style.background = '#FFF4FD';
    darkMode.style.background = 'transparent';
    darkMode.style.color = '#000';
});

darkMode.addEventListener('click', () => {
    linkDarkCSS.href = 'styles/dark.css';
    logoNode.src = 'assets/gifOF_logo_dark.png';
    localStorage.setItem('darkMode', 'enabled');
    darkMode.style.background = '#2E32FB';
    darkMode.style.color = '#FFFF';
    lightMode.style.background = 'transparent';
    lupaSearch.src = 'assets/lupa.svg';
});

function checkIfDark() {
    if (userColorPref === 'enabled') {
        linkDarkCSS.href = 'styles/dark.css';
        logoNode.src = 'assets/gifOF_logo_dark.png';
        darkMode.style.background = '#2E32FB';
        darkMode.style.color = '#FFFF'
        lightMode.style.background = 'transparent';
        lupaSearch.src = 'assets/lupa.svg';
    } else {
        lightMode.style.background = '#FFF4FD';
        darkMode.style.background = 'transparent';
    }
};

//
// Trending

function trendingLoad() {
    let urlTrend = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`;

    useRequest(urlTrend).then(response => {
        const outputElement = document.getElementById('trending');

        response.data.forEach(object => {
            const createdCont = document.createElement('div');
            const createdImage = document.createElement('img');
            const createdTitle = document.createElement('p');
            createdCont.appendChild(createdImage).src = object.images.fixed_height.url;
            createdCont.appendChild(createdTitle).innerHTML = getHashtags(object);
            createdImage.alt = object.title;
            outputElement.appendChild(createdCont);
            createdTitle.style.display = 'none';

            createdImage.onmouseover = () => {
                createdTitle.style.display = 'block';
                if (userColorPref === 'enabled') {
                    createdCont.setAttribute('style', 'box-shadow: 2px 2px 0 0 #5C5C5C, -2px -2px 0 0 #FFFFFF;');
                } else {
                    createdCont.setAttribute('style', 'box-shadow: 2px 2px 0 0 #B4B4B4, -2px -2px 0 0 #FFFFFF;');
                }
            };
            createdImage.onmouseout = () => {
                createdTitle.style.display = 'none';
                createdCont.style.boxShadow = 'none';
            };
        })
    });
};

//
// Get Hashtags

function getHashtags(gif) {
    let hashtags = ""
    let slugArray = gif.slug.split('-')
    slugArray.pop()

    if (slugArray.length !== 0) {

        slugArray = slugArray.map(e => `#${e}`)

        if (slugArray.length > 3) {
            slugArray.splice(2, slugArray.length - 1)
        }
        hashtags = slugArray.join(' ')
    } else {

        if (gif.title != "") {

            let title = gif.title.trim()
            title = title.substring(0, title.indexOf(" GIF"))
            hashtags = title.split(' ').map(e => `#${e}`).join(' ')
        }
    }
    return hashtags;
}

//
// Scroll Fx

function scrollMe(id) {
    let idYCoordinate = id.getBoundingClientRect().y - 25;
    window.scrollTo({
        top: idYCoordinate,
        behavior: 'smooth'
    });
};

//
// Fetch Fx

async function useRequest(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
};

//
// Append Gif Fx

function appendGif(response, output) {
    response.data.forEach(object => {
        let createdElement = document.createElement('img');
        output.appendChild(createdElement).src = object.images.fixed_height.url;
        createdElement.alt = object.title;
    })
};

//
// Clear Container Fx

function clearContainer(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
};

//
// Search Button State

const lupaSearch = document.getElementById('lupaSearch');

function stoppedTypingDark() {
    if (document.getElementById('searchInput').value.length > 0) {
        searchGif.disabled = false;
        searchGif.style.background = '#EE3EFE';
        searchGif.style.color = '#FFFF';
        lupaSearch.src = 'assets/lupa.svg';
        lupaSearch.style.filter = 'invert(100%)';
    } else {
        searchGif.disabled = true;
        searchGif.style.background = 'transparent';
        searchGif.style.color = '#000';
    }
};

function stoppedTypingLight() {
    if (document.getElementById('searchInput').value.length > 0) {
        searchGif.disabled = false;
        searchGif.style.background = '#f7c9f3';
        lupaSearch.src = 'assets/lupa.svg';
    } else {
        searchGif.disabled = true;
        searchGif.style.background = 'transparent';
        lupaSearch.src = 'assets/lupa_inactive.svg';
    }
};

function stoppedTyping() {
    if (userColorPref === 'enabled') {
        stoppedTypingDark()
    } else {
        stoppedTypingLight()
    }
};

//
// Hover States

function hoverWhenActiveOnLight() {
    if (document.getElementById('searchInput').value.length > 0) {
        searchGif.style.background = '#e6bbe2';
    }
}

function hoverWhenActiveOffLight() {
    if (document.getElementById('searchInput').value.length > 0) {
        searchGif.style.background = '#f7c9f3';
    }
};

function hoverWhenActiveOnDark() {
    if (document.getElementById('searchInput').value.length > 0) {
        searchGif.style.background = '#CE36DB';
    }
};

function hoverWhenActiveOffDark() {
    if (document.getElementById('searchInput').value.length > 0) {
        searchGif.style.background = '#EE3EFE';
    }
};

function hoverWhenActiveOn() {
    if (userColorPref === 'enabled') {
        hoverWhenActiveOnDark()
    } else {
        hoverWhenActiveOnLight()
    }
};

function hoverWhenActiveOff() {
    if (userColorPref === 'enabled') {
        hoverWhenActiveOffDark()
    } else {
        hoverWhenActiveOffLight()
    }
};

//
// Download Button Fx

function downloadButtonAction(id, gifOutput) {
    const downloadButton = document.createElement('a');
    id.appendChild(downloadButton).innerHTML = 'Descargar Gifo';
    downloadButton.id = 'downloadButton';
    downloadButton.href = gifOutput;
    downloadButton.target = '_blank';
    window.addEventListener('click', () => {
        downloadButton.style.display = 'none';
    });
};

//
// Clear LocalStorage Fx

logoNode.addEventListener('click', () => {
    localStorage.clear();
    clearContainer(searchHistory);
});


//
// Get Gifs From LocalStorage

const gifGetURL = `https://api.giphy.com/v1/gifs?api_key=${apiKey}&ids=${savedGifs}`;

function getMyGifs(output) {
    if (savedGifs) {
        fetch(gifGetURL)
            .then(res => {
                return res.json()

            }).then(response => {
                appendGif(response, output)
            })
            .catch(error => {
                console.log(error)
            })
    }
}