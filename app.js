let state = [
  { id: '101', title: 'Dissenyar base de dades', description: 'Crear esquema ERD', status: 'todo' },
  { id: '102', title: 'Configurar servidor Node', description: 'Express i CORS', status: 'in-progress' }
];

// ojoo:
let nextTaskId = 103;
// Les tasques inicials tenen els ID '101' i '102'.
// El comptador assignarà els ID de les tasques noves a partir de 103.


const board = document.getElementById('board');
const form = document.getElementById('new-task-form');
const template = document.getElementById('task-card-template');

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderAllTasks();
  setupEventListeners();
  updateTaskCount();
}

// MÒDUL 1 & 2

function createTaskCard(task) {
  // DOE M1.1: Clonar el template (.content.cloneNode(true))
  const clone = template.content.cloneNode(true);
  /*.content: accedeix als elements que hi ha dins del <template>: l’article, el títol, la descripció, el desplegable i els botons. Aquest contingut és un DocumentFragment, un contenidor de nodes que encara no es mostra a la pàgina.
  
  .cloneNode(true): copia aquest contingut. El true indica que també ha de copiar tots els elements interiors i el seu contingut.
  */

  // DONE M2.1: Assignar l'ID a l'atribut data-task-id de la targeta
  const card = clone.querySelector('.task-card');
  // clone.querySelector('.task-card'): busca dins de la còpia el primer element amb la classe task-card.
  card.dataset.taskId = task.id;
  //card: és l’element <article> que acabem de localitzar.
  // .dataset: és la propietat del DOM que permet accedir als atributs HTML que comencen per data-.
  // .taskId: correspon a l’atribut data-task-id


  // DONE M1.2: Omplir el títol (.task-title) i descripció (.task-desc)
  clone.querySelector('.task-title').textContent = task.title;
  //.querySelector('.task-title'): busca, dins d’aquesta còpia(clone), el primer element amb la classe task-title.
  //.textContent: és la propietat del DOM que ens permet establir el text d’aquest element.
  // = task.title: hi assigna el valor de la propietat title de la tasca rebuda. title ja existeix als objectes de state.
  clone.querySelector('.task-desc').textContent = task.description;



  // DONE M2.2: Assignar el valor del select (.task-status-select) segons task.status
  card.querySelector('.task-status-select').value = task.status;
  // ard: l’article de la targeta que hem localitzat.
  //.querySelector('.task-status-select'): busca el desplegable dins d’aquesta targeta.
  //.value: és la propietat del desplegable que permet consultar o establir el valor seleccionat.
  // = task.status: selecciona l’opció que coincideix amb l’estat de la tasca.


  // DONE M2.3: Si task.status === 'done', afegir la classe 'completed'
  if (task.status === 'done') {
    card.classList.add('completed');
    // .classList: permet consultar i modificar les classes CSS de l’element.
    // .add('completed'): afegeix la classe completed, conservant les classes que ja tenia.
  }


  // DONE M1.3: Retornar el node clonat
  return clone;
  //Per què el retornem? Perquè després renderAllTasks() el pugui rebre i afegir a la columna corresponent.
  //Aquesta línia encara no insereix res al taulell: entrega el fragment preparat a qui ha cridat createTaskCard(task).
}

function renderAllTasks() {
  // DONE M1.4: Netejar els contenidors i renderitzar les tasques de 'state' al seu contenidor corresponent
  document.getElementById('todo-list').innerHTML = '';
  //.innerHTML = '': substitueix tot el contingut interior per una cadena buida.
  document.getElementById('in-progress-list').innerHTML = '';
  document.getElementById('done-list').innerHTML = '';

  //Ara recorro tasques:
  state.forEach((currentTask) => {
    //state: és l’array de tasques
    //.forEach(): executa una funció una vegada per cada element de l’array.
    //currentTask: paràmetre que rep la tasca de cada volta

    const taskCard = createTaskCard(currentTask);
    //currentTask: és la tasca que estem recorrent en aquesta volta.
    //createTaskCard(currentTask): crida la funció que hem preparat i li passa aquesta tasca. Dins d’aquella funció, la rep el paràmetre task.
    //const taskCard =: guarda el fragment que retorna return clone;

    const taskList = document.getElementById(currentTask.status + '-list');
    //currentTask.status: llegeix l’estat de la tasca actual, per exemple 'todo'.
    // + '-list': concatena les dues cadenes. Amb 'todo', obtenim 'todo-list'.

    //Ara afegeixo la targeta al contenidor, un cop localitzat.
    taskList.appendChild(taskCard);
    //taskList: el contenidor de la columna corresponent.
    // .appendChild(...): és un mètode del DOM que afegeix el contingut indicat al final del contenidor.
    // taskCard: el fragment amb la targeta que ens ha retornat createTaskCard(currentTask).
  });
}

function setupEventListeners() {
  form.addEventListener('submit', (e) => {
    //form: és la referència al formulari. Ja està declarada al codi de partida
    e.preventDefault();
    // Evita el comportament predeterminat d’enviar el formulari, que habitualment provoca una navegació o una recàrrega de la pàgina.
    // DONE M2.4: Afegir nova tasca a 'state' i renderitzar-la al DOM
    const title = document.getElementById('task-title-input').value.trim();
    //document.getElementById('task-title-input'): localitza el camp del títol.
    // .value: llegeix el text escrit dins del camp.
    // .trim(): retorna aquest text sense espais al principi ni al final.
    const description = document.getElementById('task-desc-input').value.trim();

    const status = document.getElementById('task-status-select').value;

    if (title === '' || description === '') return; //per si user posa espais

    const newTask = {
      id: String(nextTaskId),
      // id:: és la propietat de l’objecte que guardarà l’identificador.
      // // nextTaskId: és el comptador que acabem de declarar, inicialment 103.
      // // String(...): converteix 103 en '103', perquè els ID inicials també són textos.
      title: title,
      //El primer title, abans dels dos punts, és el nom de la propietat de l’objecte
      //El segon title és la variable on hem guardat el text llegit del formulari.
      description: description,
      // MAteix, primer propietat, segon variable.
      status: status
    };
    nextTaskId++; //Preparo ID següent tasca

    state.push(newTask); // Afegim la nova tasca a l'array.

    const taskCard = createTaskCard(newTask);
    //createTaskCard(newTask): crida la funció que ja hem completat i li passa l’objecte de la nova tasca.
    // Aquesta funció clona la plantilla, hi posa les dades i retorna el fragment amb return clone;.
    // const taskCard: guarda aquest fragment.

    const taskList = document.getElementById(newTask.status + '-list');
    // És el mateix procediment que ja hem utilitzat a renderAllTasks(), però ara llegim l’estat de newTask

    taskList.appendChild(taskCard);

    form.reset();
    //això buida el títol i la descripció i torna el desplegable a «Per fer».

    updateTaskCount(); // És el nom de la funció que actualitzarà el comptador total de tasques.
    // Ja que l’enunciat demana actualitzar el comptador en inicialitzar, crear i eliminar tasques. Aquí deixem preparada la crida corresponent a la creació.

  });

  // DONE M2.5: Escoltar l'esdeveniment 'change' al board per quan es canvia l'estat del select:
  // - Trobar la targeta amb closest('.task-card')
  // - Llegir el nou estat i moure la targeta al seu contenidor (#todo-list, #in-progress-list, #done-list) amb appendChild
  // - Actualitzar l'estat a 'state' i la classe '.completed'
  board.addEventListener('change', (e) => {
    //.addEventListener('change', ...): escolta els canvis dels desplegables que hi ha dins del taulell.
    if (e.target.matches('.task-status-select')) {
      // per comprovar si el canvi prové del desplegable d’estat d’una targeta.
      //e.target: és l’element que ha originat l’esdeveniment.
      // .matches(...): és un mètode del DOM que comprova si aquest element coincideix amb un selector CSS. Retorna true o false.
      // '.task-status-select': és la classe que ja tenen els desplegables de les targetes a l’HTML.
      // if (...) {: només entra al bloc si la comprovació retorna true.
      const card = e.target.closest('.task-card');
      //e.target: és el desplegable que ha originat el canvi.
      // .closest('.task-card'): busca des d’aquest element cap amunt fins a trobar el primer element amb la classe task-card.
      // const card: guarda la referència a aquest article.
      const taskId = card.dataset.taskId;
      // card: és l’article que acabem de trobar amb closest().
      // .dataset.taskId: llegeix el valor del seu atribut HTML data-task-id.

      //Llegir nou estat seleccionat
      const newStatus = e.target.value;
      //e.target: és el desplegable de la targeta que ha originat el canvi.
      // .value: llegeix el valor de l’opció seleccionada: 'todo', 'in-progress' o 'done'.
      // const newStatus: guarda aquest valor.

      //Buscar dins de state la tasca corresponent a targeta:
      const selectedTask = state.find((task) => task.id === taskId);
      //Per poder actalitzar la tasca
      //state.find(...): busca a l’array i retorna el primer objecte que compleix la condició.
      // task: és el paràmetre que rep cada tasca durant la cerca.
      // task.id === taskId: comprova si l’ID d’aquella tasca coincideix amb el que hem llegit de la targeta.

      selectedTask.status = newStatus; //Actualitzo estat objecte trobat
      //= newStatus: hi assigna el valor que l’usuari acaba de seleccionar.

      const taskList = document.getElementById(newStatus + '-list');

      taskList.appendChild(card);
      //Com que card ja existeix al DOM, appendChild() el mou: no en crea una còpia. Deixa d’estar a la columna anterior i passa a la nova.

      card.classList.toggle('completed', newStatus === 'done');
      // card.classList: accedeix a les classes de la targeta.
      // 'completed': és la classe que ja s'ha definit al CSS.
      // newStatus === 'done': retorna true si el nou estat és «Completat» i false en qualsevol altre cas.
    }
  });


  board.addEventListener('click', (e) => {
    const target = e.target;

    // DONE M4: Acordió (closest + nextElementSibling + .collapsed)
    // Detectem el clic a la capçalera o en un element del seu interior.
    // 'header' és el nom que escollim per guardar la capçalera trobada.
    const header = target.closest('.column-header');

    if (header) {
      // Segons l'HTML de l'Albert, el germà següent de la capçalera
      // és el contenidor de tasques de la columna.
      const content = header.nextElementSibling;

      // Afegim o retirem la classe 'collapsed', ja definida al CSS.
      // toggle() retorna true si la classe queda afegida,
      // i false si queda retirada.
      const isCollapsed = content.classList.toggle('collapsed');

      // Localitzem la icona dins d'aquesta capçalera.
      const icon = header.querySelector('.toggle-icon');

      // Mostrem la icona segons si la columna està plegada o desplegada.
      if (isCollapsed) {
        icon.textContent = '▲';
      } else {
        icon.textContent = '▼';
      }
    }

    // DONE M2: Botó eliminar (closest + dataset.taskId + .remove())
    if (target.matches('.btn-delete')) {
      const card = target.closest('.task-card');
      //Trobo targeta abans d'eliminar-la

      const taskId = card.dataset.taskId;

      state = state.filter((task) => task.id !== taskId);
      //state.filter(...): crea un array amb les tasques que compleixen la condició.
      // task: és el paràmetre que rep cada tasca durant el recorregut.
      // task.id !== taskId: conserva les tasques que tenen un ID diferent del que volem eliminar.
      // state =: assigna aquest nou array a state.

      card.remove();

      updateTaskCount();
    };

    // DONE M3: Botons pujar/baixar (previousElementSibling / nextElementSibling + insertBefore)
    if (target.matches('.btn-up')) {
      const card = target.closest('.task-card');
      //target: és el botó ▲ clicat.
      // .closest('.task-card'): puja pel DOM fins a trobar l’article que conté aquest botó.
      const previousCard = card.previousElementSibling;
      //card: és la targeta que volem moure.
      // .previousElementSibling: retorna l’element germà immediatament anterior, que en aquest contenidor és la targeta de sobre.
      if (previousCard) { //Comprovo si existeix targeta anterior
        card.parentElement.insertBefore(card, previousCard);
      }
    }
    //- card.parentElement: accedeix al contenidor de la columna on és la targeta.
    // - .insertBefore(card, previousCard): mou card i la situa just abans de previousCard.
    // Per exemple, si tenim l’ordre A, B, C i premem ▲ a B, passa a ser B, A, C.

    if (target.matches('.btn-down')) {
      const card = target.closest('.task-card');
      //target: és el botó de baixar.
      // .closest('.task-card'): puja pel DOM fins a trobar l’article de la targeta.
      const nextCard = card.nextElementSibling;
      //card: és la targeta que volem baixar.
      // .nextElementSibling: retorna l’element germà immediatament posterior, que aquí és la targeta de sota.
      if (nextCard) {
        // Movem la targeta següent abans de l'actual.
        // // Així, la targeta actual queda una posició més avall.
        card.parentElement.insertBefore(nextCard, card);
    }
  }
  });
}

// MÒDUL 5: WEB COMPONENT

// DONE M5.1: Attach shadow root
// DNE M5.2: Renderització de l'etiqueta
class TaskBadge extends HTMLElement {
  constructor() {
    // Inicialitzem la part heretada d'HTMLElement.
    super();

    // Creem el Shadow DOM, tal com demana l'enunciat.
    // El mode 'open' permet accedir-hi amb this.shadowRoot.
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Aquest mètode s'executa quan el component es connecta al document.
    this.render();
  }

  static get observedAttributes() {
    // Indiquem quin atribut volem observar.
    return ['count'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Quan canvia 'count', actualitzem el contingut del component.
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    // Llegim l'atribut 'count'. Si falta o és buit, mostrem '0'.
    // 'count' és el nom que escollim per a aquesta variable.
    const count = this.getAttribute('count') || '0';

    // Posem l'HTML i els estils dins del Shadow DOM.
    // L'estructura segueix l'exemple de l'enunciat.
    // Proposem aquests estils per aproximar-nos al comptador del Loom.
    this.shadowRoot.innerHTML = `
      <style>
        .badge {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-family: system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
        }
      </style>

      <span class="badge">Total: ${count} tasques</span>
    `;
  }
}
customElements.define('task-badge', TaskBadge);


// DONE M5.3: Actualitzar l'atribut count de #global-badge
function updateTaskCount() {
  // Comptem les targetes que hi ha actualment dins del taulell.
  // Seguim l'enunciat: el recompte es fa sobre el DOM.
  const totalTasks = board.querySelectorAll('.task-card').length;

  // Localitzem el component que ja existeix a l'HTML.
  const badge = document.getElementById('global-badge');

  // Actualitzem l'atribut observat pel component.
  // Els atributs HTML guarden els valors com a text.
  badge.setAttribute('count', String(totalTasks));
}