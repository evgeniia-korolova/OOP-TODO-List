// grab all elements
const form = document.querySelector('[data-form]');
const lists = document.querySelector('[data-lists]');
const input = document.querySelector('[data-input]');
const removeAllBtn = document.querySelector('.removeAll__btn')

//local Storage
class Storage {
	static addTodStorage(todoArr) {
		let storage = localStorage.setItem('todo', JSON.stringify(todoArr));
		return storage;
	}

	static getStorage() {
		let storage =
			localStorage.getItem('todo') === null
				? []
				: JSON.parse(localStorage.getItem('todo'));
		return storage;
	}
}

// empty array
let todoArr = Storage.getStorage();

// form part
form.addEventListener('submit', (e) => {
	e.preventDefault();
	let id = Math.random() * 1000000;
	const todo = new Todo(id, input.value);
	todoArr = [...todoArr, todo];
	UI.displayData();
	UI.clearInput();
	//add to storage
    Storage.addTodStorage(todoArr);
     UI.removeBtn();
});

// make object instance
class Todo {
	constructor(id, todo) {
		this.id = id;
		this.todo = todo;
	}
}

// display the todo in the DOM;
class UI {
	static displayData() {
		let displayData = todoArr.map((item) => {
			return `
                <div class="todo">
                <p class="todo__text">${item.todo}</p>
                <div class="icon">
                <span class="edit" data-id = ${item.id}>🖊️</span>
                <span class="remove" data-id = ${item.id}>🗑️</span>
                </div>
                </div>
            `;
		});
		lists.innerHTML = displayData.join(' ');
	}
	static clearInput() {
		input.value = '';
	}
	static removeTodo() {
		lists.addEventListener('click', (e) => {
			if (e.target.classList.contains('remove')) {
				e.target.parentElement.parentElement.remove();
			}
			let btnId = e.target.dataset.id;
			//remove from array.
            UI.removeArrayTodo(btnId);
             UI.removeBtn();
		});
	}
	static removeArrayTodo(id) {
		todoArr = todoArr.filter((item) => item.id !== +id);
		Storage.addTodStorage(todoArr);
    }
    
    static editBtn() {
        let iconChange = true;
        lists.addEventListener('click', (e) => {
			if (e.target.classList.contains('edit')) {                
                let p = e.target.parentElement.previousElementSibling; 
                const btnId = e.target.dataset.id;
                if (iconChange) {
                    p.setAttribute('contenteditable', 'true');
                    p.focus();
                    e.target.textContent = "Save";
                    p.classList.add('blue');
                } else {
                    e.target.textContent = '🖊️';
                    p.classList.remove('blue');
                    p.removeAttribute('contenteditable');
                    const newArr = todoArr.findIndex(item => item.id === +btnId);
                    todoArr[newArr].todo = p.textContent;
                    Storage.addTodStorage(todoArr);
                }                
            }
            iconChange = !iconChange;			
		});
    }

    static removeAll() {
        removeAllBtn.addEventListener('click', () => {
            todoArr.length = 0;
            localStorage.clear();
            UI.displayData();
             UI.removeBtn();
        })
    }

    static removeBtn() {
        if (todoArr <= 0) {
            removeAllBtn.classList.add('hidden');
        } else {
            removeAllBtn.classList.remove('hidden');
        }
    }
}

//once the browser is loaded
window.addEventListener('DOMContentLoaded', () => {
	UI.displayData();
	//remove from the dom
    UI.removeTodo();
    UI.editBtn();
    UI.removeAll();
    UI.removeBtn();
});
