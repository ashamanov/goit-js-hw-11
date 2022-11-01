import { Notify } from 'notiflix';
import axios from 'axios';

const form = document.querySelector('#search-form');
const input = document.querySelector('[type="text"]');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API = '31018447-275bb8eed5c590f41eaba828c';

queryParams = {
  key: API,
  q: input.value,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

form.addEventListener('submit', event => {
  event.preventDefault();
  if (input.value === '') {
    Notify.warning('Enter something to request..');
  } else {
    gallery.innerHTML = '';
    queryParams.q = input.value;
    queryParams.page = 1;
    queryFunction();
  }
});

function queryFunction() {
  query()
    .then(response => {
      if (response.status !== 200) {
        throw new Error();
      }
      return response.data;
    })
    .then(data => {
      if (data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if ((data.hits.length < 40) & (data.hits.length !== 0)) {
        loadMore.style.display = 'none';
        Notify.warning(
          "We're sorry, but you've reached the end of search results.!"
        );
      } else if (data.hits.length === 40) {
        loadMore.style.display = 'flex';
      }

      const renderData = data.hits
        .map(item => {
          gallery.insertAdjacentHTML(
            'beforeend',
            `<div class="photo-card">
              <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" />
            </a>
           <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${item.likes}
            </p>
            <p class="info-item">
            
            <b>Views</b>
              ${item.views}
            </p>
            <p class="info-item">
              
            <b>Comments</b>
              ${item.comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
              ${item.downloads}
            </p>
          </div>
        </div>
     `
          );
        })
        .join('');
    })
    .catch(error => {
      console.error(error);
    });
  form.reset();
}

async function query() {
  try {
    const searchParams = new URLSearchParams(queryParams);
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    const items = response;

    return items;
  } catch (error) {
    console.error(error);
  }
}

loadMore.addEventListener('click', () => {
  queryParams.page += 1;
  queryFunction();
});
