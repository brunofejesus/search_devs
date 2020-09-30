const API_URL = 'http://localhost:3001/devs';
let languages_images = {
  Java: './images/java.png',
  JavaScript: './images/javascript.png',
  Python: './images/python.png',
};

let termSearch = {
  name: '',
  languages: ['Java', 'JavaScript', 'Python'],
  operator: 'or',
};

let mainContent = null;
let allDevs = [];
let inputSearch = null;
let checkBoxJava = null;
let checkBoxJavaScript = null;
let checkBoxPython = null;

window.addEventListener('load', () => {
  mainContent = document.querySelector('#mainContent');
  inputSearch = document.querySelector('#iptsearch');
  checkBoxJava = document.querySelector('input[name=chkjava]');
  checkBoxJavaScript = document.querySelector('input[name=chkjavascript]');
  checkBoxPython = document.querySelector('input[name=chkpython]');

  inputSearch.addEventListener('keyup', (event) => {
    termSearch.name = event.target.value;
    filterDevs();
  });

  checkBoxJava.addEventListener('change', (event) => {
    if (termSearch.languages.indexOf(event.target.value) === -1) {
      termSearch.languages[0] = event.target.value;
    } else {
      termSearch.languages[0] = '';
    }
    filterDevs();
  });

  checkBoxJavaScript.addEventListener('change', (event) => {
    if (termSearch.languages.indexOf(event.target.value) === -1) {
      termSearch.languages[1] = event.target.value;
    } else {
      termSearch.languages[1] = '';
    }
    filterDevs();
  });

  checkBoxPython.addEventListener('change', (event) => {
    if (termSearch.languages.indexOf(event.target.value) === -1) {
      termSearch.languages[2] = event.target.value;
    } else {
      termSearch.languages[2] = '';
    }
    filterDevs();
  });

  fetchDevs();
});

function handleCheckedLanguages(checkBox) {
  if (termSearch.languages.indexOf(checkBox.name) === -1) {
    termSearch.languages = [...termSearch.languages, checkBox.name];
  } else {
    termSearch.languages = termSearch.languages.filter(
      (lang) => lang !== checkBox.name
    );
  }
  filterDevs();
}

function handleClickRadio(myRadio) {
  termSearch.operator = myRadio.value;
  filterDevs();
}

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

function filterDevs() {
  let filteredDevs = allDevs.filter((dev) => {
    let langs = replaceAll(
      termSearch.languages.join(''),
      ',',
      ''
    ).toLocaleLowerCase();

    let countTrue = 0;
    if (termSearch.operator === 'and') {
      if (dev.searchlang === langs) return dev;
    } else {
      if (termSearch.languages.some((item) => dev.langarray.includes(item))) {
        return dev;
      }
    }
  });

  if (termSearch.name) {
    filteredDevs = filteredDevs.filter((dev) => {
      if (dev.search.includes(termSearch.name)) return dev;
    });
  }
  rendeDevs(Array.from(filteredDevs));
}

async function fetchDevs() {
  const res = await fetch(API_URL);
  const json = await res.json();

  allDevs = json
    .map((dev) => {
      dev.programmingLanguages.forEach((lang) => {
        delete lang.experience;
      });
      const { id, name, picture, programmingLanguages } = dev;

      return {
        id,
        name,
        search: removeWhiteSpaces(name.toLocaleLowerCase()),
        picture,
        searchlang: mountStr(programmingLanguages),
        langarray: mountArray(programmingLanguages),
        programmingLanguages,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  rendeDevs(allDevs);
}

function rendeDevs(arrayDevs) {
  let contentHtml = ``;

  arrayDevs.forEach((dev) => {
    const { name, picture, programmingLanguages } = dev;
    const columnDev = `
          <div class="column mt-2 is-one-third">
            <div class="box">
              <article class="media">
                <div class="media-left">
                  <figure class="image is-64x64">
                    <img
                      class="is-rounded"
                      src="${picture}"
                      alt="Image ${name}"
                    />
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                    <h2>${name}</h2>
                    ${renderLanguagesDev(programmingLanguages)}
                  </div>
                </div>
              </article>
            </div>
          </div>
          `;
    contentHtml += columnDev;
  });

  mainContent.innerHTML = contentHtml;
}

function mountStr(array) {
  let content = '';
  array.forEach((value) => {
    content += `${value.language}`;
  });
  return content.toLocaleLowerCase();
}

function mountArray(array) {
  let arrayNew = array.map((el) => {
    return el.language;
  });
  return arrayNew;
}

function renderLanguagesDev(languages) {
  let contentHtml = `<div class="container-lang">`;
  languages.forEach((lang) => {
    const currentHtml = `
        <img class="image is-24x24"
          src="${languages_images[lang.language]}"
          alt="Image ${lang.language}"
        />
    `;
    contentHtml += currentHtml;
  });
  contentHtml += `</div>`;
  return contentHtml;
}

function removeWhiteSpaces(value) {
  return removerAcentos(value.replace(/\s/g, ''));
}

function removerAcentos(newStringComAcento) {
  var string = newStringComAcento;
  var mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  };

  for (var letra in mapaAcentosHex) {
    var expressaoRegular = mapaAcentosHex[letra];
    string = string.replace(expressaoRegular, letra);
  }

  return string;
}
