class AddressBook {
  constructor() {
    if (!localStorage.getItem('people')) {
      localStorage.setItem('people', stringify([]));
    }

    this.alphaNumeric = new RegExp(/^[a-z]+$/, 'i');
    this.phoneNumber = new RegExp(/^0{1}[0-9]{9,10}$/);
  }

  // PUBLIC API

  addPerson() {
    const person = this.getInputValues();
    const errors = this.validate(person);
    const inputs = this.getInputs();

    inputs.forEach(input => {
      input.classList.remove('error');
    })


    // validate
    if (!errors.length) {
      const people = this.getPeopleFromStorage();
      people.push(person);
      localStorage.setItem('people', stringify(people));

      
    } else {
      errors.forEach(error => {
        const input = this.getInput(error);
        input.classList.add('error');
      })
    }
  }

  removePerson(id) {
    const people = this.getPeopleFromStorage();

    const filtered = people.filter(person => person._id !== id);

    localStorage.setItem('people', stringify(filtered));
  }

  searchPerson(search) {
    const people = this.getPeopleFromStorage();

    return people.filter(person => {
      if (person.firstName.includes(search)) return true;
      if (person.otherNames.includes(search)) return true;
      if (person.email.includes(search)) return true;
      if (person.telephone.includes(search)) return true;
      if (person.town.includes(search)) return true;
      if (person.country.includes(search)) return true;

      return false;
    });
  }


  // PRIVATE FIELDS

  alphaNumeric = undefined;

  generateRandomId() {
    function randomNum() {
      return Math.floor(Math.random() * 10);
    }

    const id = [];

    for (let i = 0; i < 16; i++) {
      if (
        id.length === 4 ||
        id.length === 9 ||
        id.length === 14
      ) {
        id.push('-');
      }

      id.push(randomNum());
    }

    return id.join('');
  }

  getInput(id) {
    return document.getElementById(id);
  }

  getInputs() {
    const inputs = [];

    inputs.push(this.getInput('first-name'));
    inputs.push(this.getInput('other-names'));
    inputs.push(this.getInput('email'));
    inputs.push(this.getInput('telephone'));
    inputs.push(this.getInput('street'));
    inputs.push(this.getInput('town'));
    inputs.push(this.getInput('country'));

    return inputs;
  }

  getInputValues() {
    function getValue(id) {
      return document.getElementById(id).value;
    }

    const person = {
      _id: this.generateRandomId(),
      firstName: getValue('first-name'),
      otherNames: getValue('other-names'),
      email: getValue('email'),
      telephone: getValue('telephone'),
      street: getValue('street'),
      town: getValue('town'),
      country: getValue('country'),
    }

    return person;
  }

  getPeopleFromStorage() {
    return parse(localStorage.getItem('people'));
  }

  validate(person) {
    const errors = [];
    if (!this.validateFirstName(person.firstName)) errors.push('first-name');
    if (!this.validateOtherNames(person.otherNames)) errors.push('other-names');
    if (!this.validateEmail(person.email)) errors.push('email');
    if (!this.validateTelephone(person.telephone)) errors.push('telephone');
    if (!this.validateAddressLine(person.street)) errors.push('street');
    if (!this.validateAddressLine(person.town)) errors.push('town');
    if (!this.validateAddressLine(person.country)) errors.push('country');

    return errors;
  }

  validateFirstName(string) {
    if (string === '') return false;
    if (!this.alphaNumeric.test(string)) return false;

    return true;
  }

  validateOtherNames(string) {
    if (string === '') return false;
    const noWhitespace = string.replace('/\s/', '');
    if (!this.alphaNumeric.test(noWhitespace)) return false;

    return true;
  }

  validateEmail(email) {
    if (email === '') return false;

    // full disclosure: taken from stackoverflow https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if (!validateEmail(email)) return false;

    return true;
  }

  validateTelephone(number) {
    if (number === '') return false;
    if (!this.phoneNumber.test(number)) return false;

    return true;
  }

  validateAddressLine(string) {
    if (string === '') return false;

    return true;
  }
}

function stringify(val) {
  return JSON.stringify(val, null, 2);
}

function parse(val) {
  return JSON.parse(val);
}

// create global instance
const book = new AddressBook();

// bind event handlaers
const personForm = document.getElementById('person-form');
personForm.addEventListener('submit', handleSubmit);

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keypress', handleSearch);

function handleSubmit(e) {
  e.preventDefault();
  book.addPerson();
}

function handleSearch(e) {
  const matches = book.searchPerson(searchInput.value);
  
  matches.forEach(person => {
    addPersonToDOM(person);
  });
}

function handleRemoval(e) {
  book.removePerson(id);
}

function addPersonToDOM(person) {
  const idSelector = `li[data-id="${person._id}"]`;

  // if person is already in the DOM don't re-add them
  if (document.querySelector(idSelector)) {
    return;
  };

  const list = document.getElementById('people');
  const li = document.createElement('li');
  li.classList.add('person-list-item');
  li.dataset.id = person._id;
  
  const pre = document.createElement('pre');
  pre.innerText = JSON.stringify(person, null, 2);
  pre.dataset.id = person._id;
  
  const button = document.createElement('button');
  button.innerText = "Remove";
  button.dataset.id = person._id;
  
  button.addEventListener('click', function() {
    book.removePerson(this.dataset.id);
    const old = document.querySelector(idSelector);

    const parent = old.parentNode;
    parent.removeChild(old);
  });

  list.appendChild(li);
  li.appendChild(pre);
  li.appendChild(button);
}