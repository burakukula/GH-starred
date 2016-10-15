const getButton = document.getElementById('gh-button');

const mainBlockOne = document.getElementById('full-box-one');
const mainBlockTwo = document.getElementById('full-box-two');

const inputOne = document.getElementById('gh-user-one');
const inputTwo = document.getElementById('gh-user-two');

const containerOne = document.getElementById('gh-user-one-items');
const containerTwo = document.getElementById('gh-user-two-items');

const headlineOne = document.getElementById('gh-user-one-headline');
const headlineTwo = document.getElementById('gh-user-two-headline');

const loadButtonOne = document.getElementById('loading-one');
const loadButtonTwo = document.getElementById('loading-two');

const prevButtonOne = document.getElementById('prev-page-user-one');
const prevButtonTwo = document.getElementById('prev-page-user-two');

let userOne = '';
let userTwo = '';

const GithubApp = class GithubStarred {

  // Initializes the GithubStarred app.
  constructor(el) {
    this.el = el;
    this.attachEvents();
  }

  attachEvents() {

    // First search event
    this.el.getButton.addEventListener('click', (event) => {
      event.preventDefault();
      userOne = this.el.inputOne.value;
      userTwo = this.el.inputTwo.value;
      let page = 1;
      this.validateInputs(userOne, userTwo);
      this.searchEvent(userOne, page, this.el.mainBlockOne, this.el.headlineOne, this.el.containerOne);
      this.searchEvent(userTwo, page, this.el.mainBlockTwo, this.el.headlineTwo, this.el.containerTwo);
    });

    // Load more data for user one.
    let userOnePage = 1;
    this.el.loadButtonOne.addEventListener('click', (e) => {
      e.preventDefault();
      userOnePage += 1;
      this.loadEvent(userOne, userOnePage, this.el.headlineOne, this.el.containerOne);
      this.el.prevButtonOne.classList.remove('sg-button-secondary--alt-disabled');
    });

    // Load prev page of the user results.
    this.el.prevButtonOne.addEventListener('click', (e) => {
      e.preventDefault();
      userOnePage -= 1;
      this.loadEvent(userOne, userOnePage, this.el.headlineOne, this.el.containerOne);
    });

    // Load more data for user two.
    let userTwoPage = 1;
    this.el.loadButtonTwo.addEventListener('click', (e) => {
      e.preventDefault();
      userTwoPage += 1;
      this.loadEvent(userTwo, userTwoPage, this.el.headlineTwo, this.el.containerTwo);
      this.el.prevButtonTwo.classList.remove('sg-button-secondary--alt-disabled');
    });

    // Load prev page of the user results.
    this.el.prevButtonTwo.addEventListener('click', (e) => {
      e.preventDefault();
      userTwoPage -= 1;
      this.loadEvent(userTwo, userTwoPage, this.el.headlineTwo, this.el.containerTwo);
    });

  }

  // Validation for inputs.
  validateInputs(a, b) {
    //check if input is empty and add error class
    if(a == '' || b == '') {
      this.el.inputOne.classList.add('sg-input--invalid');
      this.el.inputTwo.classList.add('sg-input--invalid');
      return;
    }else {
      this.el.inputOne.classList.remove('sg-input--invalid');
      this.el.inputTwo.classList.remove('sg-input--invalid');
    }
  }

  // Search for users results
  searchEvent(user, page, block, headline, container) {
    this.fetchData(user, page)
      .then((data) => {
        block.classList.remove('sg-box--full-disabled');
        headline.innerHTML = `<h2 class=\"sg-header-primary sg-header-primary--xsmall\">Repos starred by ${user}!</h2>`;
        const userData = this.tranformData(data);
        const userItems = this.prepareItemTemplate(userData).join('');
        container.innerHTML = userItems;
      });
  }


  // Load next page of user results.
  loadEvent(user, page, headline, container) {
    this.fetchData(user, page)
      .then((data) => {
        if(data == '') {
          headline.innerHTML = `<h2 class=\"sg-header-primary sg-header-primary--xsmall\">that's all folks!</h2>`;
          container.innerHTML = ``;
          return;
        } else {
          headline.innerHTML = `<h2 class=\"sg-header-primary sg-header-primary--xsmall\">Repos starred by ${user}!</h2>`;
        }
        const userData = this.tranformData(data);
        const userItems = this.prepareItemTemplate(userData).join('');
        container.innerHTML = userItems;
      });
  }

  // Fetch data
  fetchData(user, el) {
    const url = 'https://api.github.com/users/' + user + '/starred?page=' + el + '&per_page=30';
    return fetch(url)
      .then(response => {
        return response.json()
      .then(json => {
        return response.ok ? json : Promise.reject(json);
      });
    });
  }

  // Transform data after fetch
  tranformData(usersData) {
    if(typeof usersData !== 'undefined') {
      const repo = usersData.map((item) => ({
        name : item.name,
        url : item.html_url,
        description : item.description,
        ownerName : item.owner.login,
        ownerAvatar : item.owner.avatar_url
      }));
      return repo;
    }
  }

  // Prepare html template after transform data
  prepareItemTemplate(data) {
    return data.map((item) => {
      let htmlTemplate = `<li class=\"sg-box sg-box-custom\"><div class=\"sg-box__hole\"><div class=\"sg-content-box\"><div class=\"sg-content-box__header\"><div class=\"sg-avatar sg-avatar--small\"><img class=\"sg-avatar__image\" src=\"${item.ownerAvatar}\"></div><h2 class="sg-header-secondary sg-header-secondary--custom">${item.name} created by ${item.ownerName}</h2></div><p class="sg-text">${item.description}</p><div class=\"sg-content-box__actions\"><a href=\"${item.url}\" target=\"_blank\" class=\"sg-link sg-link--mint\">Go to the project</a></div></div></div></div></div></li>`;
      return htmlTemplate;
    });
  }
};

new GithubApp({
  getButton,
  loadButtonOne,
  loadButtonTwo,
  prevButtonOne,
  prevButtonTwo,
  inputOne,
  inputTwo,
  mainBlockOne,
  mainBlockTwo,
  containerOne,
  containerTwo,
  headlineOne,
  headlineTwo
});
